import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Chuyển đổi dữ liệu sang x-www-form-urlencoded cho FastAPI
        const formData = new URLSearchParams();
        formData.append("username", credentials.email as string);
        formData.append("password", credentials.password as string);

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/jwt/login`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
          });

          if (!res.ok) return null;

          const data = await res.json();
          
          // Trả về object chứa token. Auth.js yêu cầu có trường 'id'
          return {
            id: "jwt-user", // ID tạm, ta sẽ dùng accessToken để định danh
            accessToken: data.access_token,
          };
        } catch (error) {
          console.error("Lỗi kết nối Backend:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    // Lưu accessToken từ authorize() vào token của Auth.js
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    // Đẩy accessToken ra session để Client (React Component) có thể lấy được
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    }
  },
  pages: {
    signIn: "/login", // Đường dẫn tới trang UI login của bạn
  },
  session: {
    strategy: "jwt", // Bắt buộc dùng JWT strategy khi xài Credentials
  }
});