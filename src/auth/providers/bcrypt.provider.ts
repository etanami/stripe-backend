import * as bcrypt from 'bcryptjs';

import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class BcryptProvider implements HashingProvider {
  async hashingPassword(data: string | Buffer): Promise<string> {
    // Generate salt for hashing password using bcrypt
    const salt = await bcrypt.genSalt();

    if (typeof data === 'string') {
      return bcrypt.hash(data, salt);
    } else {
      return bcrypt.hash(data.toString(), salt);
    }
  }

  comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
    if (typeof data === 'string') {
      return bcrypt.compare(data, encrypted);
    } else {
      return bcrypt.compare(data.toString(), encrypted);
    }
  }
}
