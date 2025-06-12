import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwt } from '@nestjs/jwt';
import { VerifyJwtPresenter } from './presenters/verify-jwt.presenter';
import { SignJwtParams } from './types/sign-jwt-params.type';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwt,
    private readonly configService: ConfigService,
  ) {}

  async signJwt({ id, email }: SignJwtParams): Promise<string> {
    const payload = { sub: id, email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });

    return accessToken;
  }

  async verifyJwt(token: string): Promise<VerifyJwtPresenter> {
    try {
      const payload: { sub: string; email: string } =
        await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('JWT_SECRET'),
        });

      return new VerifyJwtPresenter({
        userId: payload.sub,
        email: payload.email,
      });
    } catch (err) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
