export interface IUserCookie {
  userId?: string;
  username?: string;
  email?: string;
  access_token?: string;
  idToken?: string; // access token hoặc session token
  role?: string; // quyền hạn: admin, user, etc.
  expiresAt?: string; // thời gian hết hạn của cookie
}

export interface User {
  email: string;
  name: string;
  accessToken: string; // Thêm dòng này
  // các thuộc tính khác nếu có
}
