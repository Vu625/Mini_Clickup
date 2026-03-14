"use client";

import { signOut } from "next-auth/react";

const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
    >
      Đăng xuất
    </button>
  );
};

export default LogoutButton;