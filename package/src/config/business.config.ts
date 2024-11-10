import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Injectable()
export class BusinessConfig {
  @Transform(({ value }) => (value !== undefined ? Number(value) : Number.MAX_SAFE_INTEGER))
  @IsNumber()
  BITCOIN_WALLET_MAX_BLOCK_HEIGHT: number = Number.MAX_SAFE_INTEGER;

  @Transform(({ value }) => (value !== undefined ? Number(value) : 0))
  @IsNumber()
  BITCOIN_WALLET_START_BLOCK_HEIGHT: number = 0;

  @Transform(({ value }) => (value !== undefined ? value : 'BTC'))
  @IsString()
  BITCOIN_WALLET_CURRENCY_TICKER: string = 'BTC';

  @Transform(({ value }) => (value !== undefined ? Number(value) : 8))
  @IsNumber()
  BITCOIN_WALLET_CURRENCY_DIGITS: number = 8;

  @Transform(({ value }) => (value ? value : 'testnet'))
  @IsString()
  BITCOIN_WALLET_BLOCKCHAIN_NETWORK_NAME: string = 'testnet';
}
