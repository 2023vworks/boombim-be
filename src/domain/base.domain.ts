export interface BaseDomainProps {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseDomain<PROPS> implements BaseDomainProps {
  protected props: PROPS;

  #id: number;
  #createdAt: Date;
  #updatedAt: Date;

  protected constructor(props: PROPS) {
    this.props = props;
  }

  get id(): number {
    return this.#id;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  setBase(id: number, createdAt: Date, updatedAt: Date) {
    this.#id = id;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
    return this;
  }
}
