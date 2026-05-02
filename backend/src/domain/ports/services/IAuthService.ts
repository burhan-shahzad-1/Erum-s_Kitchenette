export interface TokenPayload {
  userId: string;
  role: string;
}

export interface IAuthService {
  generateToken(userId: string, role: string): string;
  verifyToken(token: string): TokenPayload | null;
  hashPassword(password: string): Promise<string>;
  comparePassword(plain: string, hash: string): Promise<boolean>;
}
