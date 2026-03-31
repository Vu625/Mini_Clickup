// src/middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth; // Kiểm tra xem đã có session chưa
  const { nextUrl } = req;

  // 1. Định nghĩa các nhóm Route
  const isDashboardRoute = nextUrl.pathname.startsWith("/workspace");
  const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

  // 2. Nếu đang truy cập Dashboard mà chưa đăng nhập -> Đá về Login
  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // 3. Nếu đã đăng nhập mà lại cố vào Login/Register -> Đá về Dashboard
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/workspace", nextUrl));
  }

  return NextResponse.next();
});

// 4. Quan trọng: Chỉ chạy middleware cho những route này
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};