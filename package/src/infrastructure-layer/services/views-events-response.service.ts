import { Injectable, Inject } from '@nestjs/common';
import { CustomEventBus, EventBus } from '@easylayer/components/cqrs';
import { filter, firstValueFrom } from 'rxjs';

@Injectable()
export class ViewsEventsResponseService {
  constructor(
    @Inject(EventBus)
    private readonly eventBus: CustomEventBus
  ) {}

  async waitForEventResult(requestId: string): Promise<any> {
    return firstValueFrom(
      this.eventBus.eventHandlerCompletionSubject$.pipe(
        filter((result: any) => {
          return result.payload.requestId === requestId;
        })
      )
    );
  }

  // waitForEventResult(requestId: string, callback: (result: any) => void): Subscription {
  //   return this.eventBus.eventHandlerCompletionSubject$
  //     .pipe(filter((result: any) => result.requestId === requestId))
  //     .subscribe(callback);
  // }
}
