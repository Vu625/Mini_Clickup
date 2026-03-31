from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select,delete
from app.models.user import User
from app.models.notification import Notification
from app.models.workspace import Workspace, WorkspaceMember, WorkspaceInvitation
from app.schemas.workspace import WorkspaceCreate, WorkspaceUpdate , InvitationCreate
from fastapi import HTTPException
from fastapi import status

async def create_workspace(db: AsyncSession, obj_in: WorkspaceCreate, owner_id: UUID) -> Workspace:
    data_dir=obj_in.model_dump()

    # 1. Tạo Workspace mới
    db_obj = Workspace(
        **data_dir,
        owner_id=owner_id
    )
    db.add(db_obj)
    await db.flush() # Lấy ID của workspace vừa tạo mà chưa commit hoàn toàn
    
    # 2. Tự động thêm User tạo vào bảng WorkspaceMember với quyền Owner
    member_obj = WorkspaceMember(
        workspace_id=db_obj.id,
        user_id=owner_id,
        role_in_workspace="Owner"
    )
    db.add(member_obj)
    
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def get_workspaces_by_user(db: AsyncSession, user_id: UUID):
    # Lấy danh sách workspace mà user là thành viên
    statement = select(Workspace).join(WorkspaceMember).where(WorkspaceMember.user_id == user_id)
    result = await db.execute(statement)
    return result.scalars().all()

async def update_workspace(db: AsyncSession, db_obj: Workspace, obj_in: WorkspaceUpdate) -> Workspace:
    update_data = obj_in.model_dump(exclude_unset=True)
    for field in update_data:
        setattr(db_obj, field, update_data[field])
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def delete_workspace(db: AsyncSession, id: UUID) -> bool:
    statement = select(Workspace).where(Workspace.id == id)
    result = await db.execute(statement)
    db_obj = result.scalar_one_or_none()
    if db_obj:
        await db.delete(db_obj)
        await db.commit()
        return True
    return False

async def invite_user_to_workspace(
    db: AsyncSession, 
    workspace_id: UUID, 
    inviter_id: UUID, 
    obj_in: InvitationCreate
):
    # 1. Kiểm tra xem user được mời đã có trong workspace chưa
    # (Bạn có thể thêm logic tìm User ID từ Email tại đây)
    
    invitation = WorkspaceInvitation(
        workspace_id=workspace_id,
        inviter_id=inviter_id,
        invitee_email=obj_in.invitee_email,
        role=obj_in.role
    )
    db.add(invitation)
    await db.commit()
    await db.refresh(invitation)
    return invitation

async def get_my_invitations(db: AsyncSession, user_email: str):
    # Join với bảng Workspace để lấy thêm thông tin tên workspace
    statement = (
        select(
            WorkspaceInvitation.id,
            WorkspaceInvitation.workspace_id,
            WorkspaceInvitation.inviter_id,
            WorkspaceInvitation.role,
            WorkspaceInvitation.status,
            Workspace.name.label("workspace_name")
        )
        .join(Workspace, WorkspaceInvitation.workspace_id == Workspace.id)
        .where(
            WorkspaceInvitation.invitee_email == user_email,
            WorkspaceInvitation.status == "pending" # Chỉ lấy những lời mời đang chờ
        )
    )
    
    result = await db.execute(statement)
    # Chuyển đổi result thành list các dictionary để khớp với Schema
    return result.mappings().all()

async def accept_invitation(db: AsyncSession, invitation_id: UUID, current_user: User):
    # 1. Tìm lời mời
    statement = select(WorkspaceInvitation).where(WorkspaceInvitation.id == invitation_id)
    result = await db.execute(statement)
    invitation = result.scalar_one_or_none()

    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    # 2. Kiểm tra bảo mật: Email lời mời phải khớp với Email User đang đăng nhập
    if invitation.invitee_email != current_user.email:
        raise HTTPException(status_code=403, detail="This invitation is not for you")
    
    check_statement = select(WorkspaceMember).where(
        WorkspaceMember.workspace_id == invitation.workspace_id,
        WorkspaceMember.user_id == current_user.id
    )
    existing_member = await db.execute(check_statement)
    if existing_member.scalar_one_or_none():
        # Nếu đã là thành viên, ta xóa lời mời thừa này đi và báo lỗi nhẹ nhàng
        await db.delete(invitation)
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="You are already a member of this workspace"
        )

    # 3. Tạo record mới trong WorkspaceMember
    new_member = WorkspaceMember(
        workspace_id=invitation.workspace_id,
        user_id=current_user.id,
        role_in_workspace=invitation.role
    )
    db.add(new_member)

    # 4. Xóa lời mời sau khi đã chấp nhận (hoặc cập nhật status = 'accepted')
    await db.delete(invitation)

    notification = Notification(
    receiver_id=invitation.inviter_id,
    content=f"{current_user.full_name} đã chấp nhận tham gia Workspace",
)
    db.add(notification)
    
    await db.commit()
    return {"message": "Successfully joined the workspace"}

async def decline_invitation(db: AsyncSession, invitation_id: UUID, current_user: User):
    # Tìm và xóa lời mời
    statement = select(WorkspaceInvitation).where(
        WorkspaceInvitation.id == invitation_id,
        WorkspaceInvitation.invitee_email == current_user.email
    )
    result = await db.execute(statement)
    invitation = result.scalar_one_or_none()

    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found or not authorized")

    await db.delete(invitation)
    notification = Notification(
    receiver_id=invitation.inviter_id,
    content=f"{current_user.full_name} đã chấp nhận tham gia Workspace",
)
    db.add(notification)
    await db.commit()
    return {"message": "Invitation declined"}