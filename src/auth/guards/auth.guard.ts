import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('There is not bearer token');

    try {

      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token, { secret: process.env.JWT_SECRET_KEY } // Token enviado en la request + la firma
      );

      const user:User = await this.authService.findUserById(payload.id);

      if ( !user ) throw new UnauthorizedException('User does not exists!');
      if ( !user.isActive ) throw new UnauthorizedException('User is not active!');

      // El payload contiene los datos del usuario, request es lo que le pasamos al controllador
      // También podriamos determinar el rol que tiene.
      request['user'] = user;

    } catch (error) {
      throw new UnauthorizedException();
    }
    // Solo llega si tiene accceso.
    return Promise.resolve(true);
  }

  private extractTokenFromHeader({ headers }: Request): string | undefined {
    const [type, token] = headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}
