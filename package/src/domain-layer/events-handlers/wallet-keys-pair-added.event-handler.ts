import { EventsHandler, IEventHandler } from '@easylayer/components/cqrs';
import { BitcoinWalletKeysPairAddedEvent } from '@easylayer/common/domain-cqrs-components/bitcoin-wallet';

@EventsHandler(BitcoinWalletKeysPairAddedEvent)
export class BitcoinWalletKeysPairAddedEventHandler implements IEventHandler<BitcoinWalletKeysPairAddedEvent> {
  async handle({ payload }: BitcoinWalletKeysPairAddedEvent) {
    const { requestId, aggregateId, publicKeyHash } = payload;

    return {
      result: { requestId, aggregateId, publicKeyHash },
    };
  }
}
