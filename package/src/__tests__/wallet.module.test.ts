import { Test, TestingModule } from '@nestjs/testing';
import { BitcoinWalletModule } from '../wallet.module';

describe('BitcoinWalletModule', () => {
  let bitcoinWalletModule: BitcoinWalletModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BitcoinWalletModule],
    }).compile();

    bitcoinWalletModule = module.get<BitcoinWalletModule>(BitcoinWalletModule);
  });

  it('should be defined', () => {
    expect(bitcoinWalletModule).toBeDefined();
  });
});
