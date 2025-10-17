import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Authentication guard that validates a hardcoded bearer token
 * In production, this should be replaced with proper JWT validation
 */
@Injectable()
export class AuthGuard implements CanActivate {
  // Hardcoded token for development
  private readonly VALID_TOKEN = 'pokedex-secret-token-2024';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    // Extract token from "Bearer <token>"
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
      throw new UnauthorizedException('Authorization type must be Bearer');
    }

    if (!token || token !== this.VALID_TOKEN) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
