import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HashingService } from './hashing.service';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class BcryptService implements HashingService {
  constructor(private readonly configService: ConfigService) {}

  async hash(data: string | Buffer): Promise<string> {
    const saltRounds = this.configService.get<number>(
      'encryption.numberOfSaltRounds',
    );
    const salt = await genSalt(saltRounds);
    return hash(data, salt);
  }

  compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
