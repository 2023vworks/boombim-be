import { UnionValidatorDefaultOptions } from '../validator/union-validator/type';

export type RestApiDecoratorDefaultOptions = UnionValidatorDefaultOptions & {
  description?: string;
  isArray?: boolean;
  default?: unknown;
};
