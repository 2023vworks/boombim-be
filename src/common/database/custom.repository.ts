import { EntityManager, EntityTarget, Repository } from 'typeorm';

export class CustomRepository<Entity> extends Repository<Entity> {
  constructor(
    readonly targetEntity: EntityTarget<Entity>,
    readonly manager: EntityManager,
  ) {
    super(targetEntity, manager, manager.queryRunner);
  }

  /**
   * queryRunner.manager를 주입받아 트랜잭션에 사용할 새로운 Repository 생성 리턴한다.
   * @param manager - queryRunner.manager
   */
  createTransactionRepo(manager: EntityManager): this {
    const constructor = this.constructor;
    if (!manager.queryRunner) {
      throw new Error('EntityManager does not have queryRunner.');
    }
    if (constructor.name === 'CustomRepository') {
      throw new Error('Instance is not CustomRepository child.');
    }
    return new (constructor as any)(manager);
  }
}
