import { CommandHandler, ICommandHandler } from '@easylayer/components/cqrs';
import { Transactional, EventStoreRepository } from '@easylayer/components/eventstore';
import { AddKeysPairCommand } from '@easylayer/common/domain-cqrs-components/bitcoin-wallet';
import { WalletService } from '@easylayer/components/bitcoin-network-provider';
import { AppLogger, RuntimeTracker } from '@easylayer/components/logger';
import { Wallet } from '../models/wallet.model';
import { WalletModelFactoryService } from '../services';
import { KeysStorageRepositoryService } from '../../infrastructure-layer/services';
import { BusinessConfig } from '../../config';

@CommandHandler(AddKeysPairCommand)
export class AddKeysPairCommandHandler implements ICommandHandler<AddKeysPairCommand> {
  constructor(
    private readonly log: AppLogger,
    private readonly businessConfig: BusinessConfig,
    private readonly eventStore: EventStoreRepository,
    private readonly walletModelFactory: WalletModelFactoryService,
    // private readonly networkProvider: NetworkProviderService,
    private readonly walletService: WalletService,
    private readonly keysStorageRepository: KeysStorageRepositoryService
  ) {}

  @Transactional({ connectionName: 'wallet-eventstore' })
  @RuntimeTracker({ showMemory: true })
  async execute({ payload }: AddKeysPairCommand) {
    try {
      const { requestId, mnemonic, seed, privateKey } = payload;

      const walletModel: Wallet = await this.walletModelFactory.initModel();

      await walletModel.addOneKeysPair({
        requestId,
        mnemonic,
        seed,
        privateKey,
        walletService: this.walletService,
        keysStorageRepository: this.keysStorageRepository,
        logger: this.log,
        networkName: this.businessConfig.BITCOIN_WALLET_BLOCKCHAIN_NETWORK_NAME,
      });

      await this.eventStore.save(walletModel);
      await walletModel.commit();
    } catch (error) {
      this.log.error('execute()', error, this.constructor.name);
      throw error;
    }
  }
}
