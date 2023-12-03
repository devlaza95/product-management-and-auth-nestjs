import { EventSubscriber, FlushEventArgs } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnFlushEventSubscriber implements EventSubscriber {
  constructor(private readonly em: EntityManager) {
    this.em.getEventManager().registerSubscriber(this);
  }

  // https://mikro-orm.io/docs/events#using-onflush-event
  async onFlush(args: FlushEventArgs): Promise<void> {
    console.log('***** onFlush *****', args);
  }
}
