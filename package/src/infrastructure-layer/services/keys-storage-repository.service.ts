import { Injectable } from '@nestjs/common';
import { Repository, InjectRepository } from '@easylayer/components/secure-storage';
import { KeysViewModel } from '../view-models';

@Injectable()
export class KeysStorageRepositoryService {
  constructor(
    // IMPORTANT: 'keys-storage' name have to be the same as name in module connection
    @InjectRepository(KeysViewModel, 'keys-storage')
    private readonly repository: Repository<KeysViewModel>
  ) {}

  public async add(keyData: Partial<KeysViewModel>): Promise<void> {
    const { public_key_hash } = keyData;

    if (!public_key_hash) {
      throw new Error('public_key_hash is required');
    }

    await this.repository.upsert(keyData, ['public_key_hash']);
  }

  async remove(pubKeyHash: string): Promise<KeysViewModel | null> {
    // const public_key_hash = Buffer.from(pubKeyHash, 'hex');
    const existingKey = await this.repository.findOneBy({ public_key_hash: pubKeyHash });

    if (!existingKey) {
      return null;
    }

    await this.repository.remove(existingKey);
    return existingKey;
  }

  async findOneByPublicKeyHash(pubKeyHash: string): Promise<KeysViewModel | null> {
    // const public_key_hash = Buffer.from(pubKeyHash, 'hex');
    return this.repository.findOneBy({ public_key_hash: pubKeyHash });
  }

  async findOneByMnemonic(mnemonic: string): Promise<KeysViewModel | null> {
    return this.repository.findOneBy({ mnemonic });
  }

  async findOneBySeed(seed: string): Promise<KeysViewModel | null> {
    return this.repository.findOneBy({ seed });
  }
}
