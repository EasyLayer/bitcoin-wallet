import { Module, DynamicModule } from '@nestjs/common';
import { transformAndValidate } from 'class-transformer-validator';
import { CqrsModule } from '@easylayer/components/cqrs';
import { CqrsTransportModule } from '@easylayer/components/cqrs-transport';
import { LoggerModule } from '@easylayer/components/logger';
import { ArithmeticService } from '@easylayer/common/arithmetic';
import { EventStoreModule } from '@easylayer/components/eventstore';
import { SecureStorageModule } from '@easylayer/components/secure-storage';
import { NetworkProviderModule } from '@easylayer/components/bitcoin-network-provider';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { KeysPairSaga } from './application-layer/sagas';
import { ReadStateExceptionHandlerService, WalletCommandFactoryService } from './application-layer/services';
import { WalletModelFactoryService } from './domain-layer/services';
import { ViewsEventsResponseService, KeysStorageRepositoryService } from './infrastructure-layer/services';
import { CommandHandlers } from './domain-layer/command-handlers';
import { EventsHandlers } from './domain-layer/events-handlers';
import { AppConfig, BusinessConfig, EventStoreConfig, KeyStorageConfig, ProvidersConfig } from './config';
import { KeysViewModel } from './infrastructure-layer/view-models';

interface WalletModuleOptions {
  appName: string;
  //...
}

@Module({})
export class BitcoinWalletModule {
  static async register({ appName }: WalletModuleOptions): Promise<DynamicModule> {
    const eventstoreConfig = await transformAndValidate(EventStoreConfig, process.env, {
      validator: { whitelist: true },
    });
    const keystorageConfig = await transformAndValidate(KeyStorageConfig, process.env, {
      validator: { whitelist: true },
    });
    const appConfig = await transformAndValidate(AppConfig, process.env, {
      validator: { whitelist: true },
    });
    const businessConfig = await transformAndValidate(BusinessConfig, process.env, {
      validator: { whitelist: true },
    });
    const providersConfig = await transformAndValidate(ProvidersConfig, process.env, {
      validator: { whitelist: true },
    });

    return {
      module: BitcoinWalletModule,
      controllers: [WalletController],
      imports: [
        LoggerModule.forRoot({ componentName: appName }),
        CqrsTransportModule.forRoot({ isGlobal: true }),
        CqrsModule.forRoot({ isGlobal: true }),
        // IMPORTANT: NetworkProviderModule must be global inside one plugin
        NetworkProviderModule.forRootAsync({
          isGlobal: true,
          quickNodesUrls: providersConfig.BITCOIN_WALLET_NETWORK_PROVIDER_QUICK_NODE_URLS,
          selfNodesUrl: providersConfig.BITCOIN_WALLET_NETWORK_PROVIDER_SELF_NODE_URL,
        }),
        EventStoreModule.forRootAsync({
          name: 'wallet-eventstore',
          logging: eventstoreConfig.isLogging(),
          type: eventstoreConfig.BITCOIN_WALLET_EVENTSTORE_DB_TYPE,
          database: eventstoreConfig.BITCOIN_WALLET_EVENTSTORE_DB_NAME,
          ...(eventstoreConfig.BITCOIN_WALLET_EVENTSTORE_DB_HOST && {
            host: eventstoreConfig.BITCOIN_WALLET_EVENTSTORE_DB_HOST,
          }),
          ...(eventstoreConfig.BITCOIN_WALLET_EVENTSTORE_DB_PORT && {
            port: eventstoreConfig.BITCOIN_WALLET_EVENTSTORE_DB_PORT,
          }),
          ...(eventstoreConfig.BITCOIN_WALLET_EVENTSTORE_DB_USERNAME && {
            username: eventstoreConfig.BITCOIN_WALLET_EVENTSTORE_DB_USERNAME,
          }),
          ...(eventstoreConfig.BITCOIN_WALLET_EVENTSTORE_DB_PASSWORD && {
            password: eventstoreConfig.BITCOIN_WALLET_EVENTSTORE_DB_PASSWORD,
          }),
        }),
        SecureStorageModule.forRootAsync({
          name: 'keys-storage',
          type: 'better-sqlite3',
          logging: keystorageConfig.isLogging(),
          entities: [KeysViewModel],
          database: keystorageConfig.BITCOIN_WALLET_KEYSTORAGE_DB_NAME,
          password: keystorageConfig.BITCOIN_WALLET_KEYSTORAGE_DB_PASSWORD,
        }),
      ],
      providers: [
        {
          provide: AppConfig,
          useValue: appConfig,
        },
        {
          provide: BusinessConfig,
          useValue: businessConfig,
        },
        {
          provide: EventStoreConfig,
          useValue: eventstoreConfig,
        },
        {
          provide: KeyStorageConfig,
          useValue: keystorageConfig,
        },
        KeysStorageRepositoryService,
        WalletCommandFactoryService,
        ViewsEventsResponseService,
        ArithmeticService,
        WalletService,
        KeysPairSaga,
        ViewsEventsResponseService,
        WalletModelFactoryService,
        ReadStateExceptionHandlerService,
        ...CommandHandlers,
        ...EventsHandlers,
      ],
      exports: [],
    };
  }
}
