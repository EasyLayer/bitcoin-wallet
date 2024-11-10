import { Controller, Body, Post } from '@nestjs/common';
import { WalletService } from '@easylayer/components/bitcoin-network-provider';
import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { WalletCommandFactoryService } from './application-layer/services';
import { ViewsEventsResponseService } from './infrastructure-layer/services';
import { BusinessConfig } from './config';

enum SortingDirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class SortingDto {
  @IsString()
  readonly field!: string;

  @IsOptional()
  @IsEnum(SortingDirectionEnum)
  readonly direction?: SortingDirectionEnum;
}

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  readonly limit?: number;

  @IsOptional()
  @IsNumber()
  readonly offset?: number;
}

@Controller()
export class WalletController {
  constructor(
    private readonly businessConfig: BusinessConfig,
    private readonly walletService: WalletService,
    private readonly walletCommandFactory: WalletCommandFactoryService,
    private readonly viewsEventsResponseService: ViewsEventsResponseService
  ) {}

  @Post()
  async handleRpcRequest(@Body() body: any): Promise<any> {
    if (body.method === 'addKeysPair') {
      const { requestId, mnemonic, seed, privateKey } = body.params;

      // Пример с колбеком, может сделать чтобы ответ там сразу отправлялся пользвоателю
      // this.viewsEventsResultService.waitForEventResult(requestId, async (result) => {
      //   // Возвращаем результат клиенту через колбэк
      //   return {
      //     jsonrpc: '2.0',
      //     result,
      //     requestId: body.requestId,
      //   };
      // });

      // Это тупой вариант но пока так, там есть варианты
      // Во первых сдлать декораторы, во вторых обьеденить все в одном сервисе
      // или под каждую сущность сервис и там вызывать сразу команды и событие.

      const eventResultPromise = this.viewsEventsResponseService.waitForEventResult(requestId);

      await this.walletCommandFactory.addKeysPair({ requestId, mnemonic, seed, privateKey });

      const result = await eventResultPromise;

      return {
        jsonrpc: '2.0',
        result,
        id: body.requestId,
      };
    }

    if (body.method === 'generateHDKeysPairs') {
      const { requestId, count } = body.params;

      const wallets: any = [];

      const networkName: string = this.businessConfig.BITCOIN_WALLET_BLOCKCHAIN_NETWORK_NAME;

      for (let i = 0; i < count; i++) {
        const keypair = await this.walletService.generateHDKeysPair(networkName);
        wallets.push(keypair);
      }

      return {
        jsonrpc: '2.0',
        wallets,
        id: requestId,
      };
    }

    // TODO
    // if (body.method === 'generateKeysPairsInOneHDWallet') {}

    return {
      jsonrpc: '2.0',
      error: {
        code: -32601,
        message: 'Method not found',
      },
      id: body.requestId,
    };
  }
}
