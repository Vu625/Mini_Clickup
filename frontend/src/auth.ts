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
          const token = data.access_token;
          
          const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/me`, {
          headers: { "Authorization": `Bearer ${token}` },
          });
          if (!userRes.ok) return null;
          const userData = await userRes.json();
          // Trả về object chứa token. Auth.js yêu cầu có trường 'id'
          return {
            id: userData.id, // ID tạm, ta sẽ dùng accessToken để định danh
            accessToken: data.access_token,
            email: userData.email,
            name: userData.full_name,
          };
        } catch (error) {
          console.error("Lỗi kết nối Backend:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/workspace");
      
      if (isDashboard) {
        if (isLoggedIn) return true;
        return false; // Trả về false sẽ tự động redirect về trang login đã định nghĩa
      }
      return true;
    },
    // Lưu accessToken từ authorize() vào token của Auth.js
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id; // Lưu ID vào token
      }
      return token;
    },
    // Đẩy accessToken ra session để Client (React Component) có thể lấy được
    async session({ session, token }) {
      // session.accessToken = token.accessToken;
      // return session;
      if (session.user) {
      session.accessToken = token.accessToken as string;
      session.user.id = token.id as string; // Đẩy ID ra session.user
    }
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