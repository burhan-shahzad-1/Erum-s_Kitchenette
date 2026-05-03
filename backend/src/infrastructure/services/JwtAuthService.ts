import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IAuthService, TokenPayload } from '../../domain/ports/services/IAuthService';
import { env } from '../../config/env';

export class JwtAuthService implements IAuthService {
  generateToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, env.jwtSecret) as TokenPayload;
    } catch {
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
