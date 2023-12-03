import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActiveUser } from './decorators/active-user.decorator';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { SignOutDto } from './dto/sign-out.dto';
import { AuthenticationGuard } from './guards/authentication.guard';

@ApiTags('Authentication')
@Auth(AuthType.None)
@Controller({ path: 'authentication', version: '1' })
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth('accessToken')
  @Post('sign-out')
  signOut(@ActiveUser() activeUser: ActiveUserData) {
    return this.authService.signOut(new SignOutDto(activeUser.userId));
  }
}
