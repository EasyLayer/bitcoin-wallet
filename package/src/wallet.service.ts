import { v4 as uuidv4 } from 'uuid';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { AppLogger } from '@easylayer/components/logger';
import { WalletCommandFactoryService } from './application-layer/services';

@Injectable()
export class WalletService implements OnModuleInit {
  constructor(
    private readonly log: AppLogger,
    private readonly walletCommandFactory: WalletCommandFactoryService
  ) {}

  async onModuleInit() {
    await this.initialization();
  }

  private async initialization(): Promise<void> {
    this.log.info('Initialization all systems');

    try {
      await this.walletCommandFactory.init({
        requestId: uuidv4(),
      });
    } catch (error) {
      this.log.error('initialization()', error, this.constructor.name);
      throw error;
    }
  }
}
