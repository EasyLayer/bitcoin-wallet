import { resolve } from 'node:path';
import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

@Injectable()
export class KeyStorageConfig {
  @Transform(({ value }) => (value ? value : ''))
  @IsString()
  BITCOIN_WALLET_KEYSTORAGE_DB_PASSWORD!: string;

  @Transform(({ value }) => (value ? value : ''))
  @IsString()
  BITCOIN_WALLET_KEYSTORAGE_DB_NAME: string = resolve(process.cwd(), `data/keys-storage.enc.db`);

  isLogging(): boolean {
    return process.env.DB_DEBUG === '1';
  }
}
