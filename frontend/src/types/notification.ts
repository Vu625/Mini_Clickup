export interface Notification {
  id: string;
  receiver_id: string;
  content: string;
  link?: string;
  is_read: boolean;
  created_at: string; // Backend gửi datetime dưới dạng string ISO
}

export interface MarkReadResponse {
  status: string;
}