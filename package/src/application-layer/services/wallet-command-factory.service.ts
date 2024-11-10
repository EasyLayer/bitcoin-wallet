// import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@easylayer/components/cqrs';
import { InitWalletCommand, AddKeysPairCommand } from '@easylayer/common/domain-cqrs-components/bitcoin-wallet';

@Injectable()
export class WalletCommandFactoryService {
  constructor(private readonly commandBus: CommandBus) {}

  public async init(dto: any): Promise<void> {
    return await this.commandBus.execute(new InitWalletCommand(dto));
  }

  public async addKeysPair(dto: any): Promise<void> {
    return await this.commandBus.execute(new AddKeysPairCommand(dto));
  }
}
