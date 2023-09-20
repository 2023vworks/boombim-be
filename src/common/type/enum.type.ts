type Enum<T extends object> = Record<keyof T, string | number>;
export type EnumKey<T extends Enum<T>> = keyof T;
export type EnumValue<T extends Enum<T>> = T[keyof T];
export type EnumValueObject<T extends string> = Record<T, string>;
