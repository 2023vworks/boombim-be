export type PrimitiveType = string | number | boolean | null | undefined;
export type PrimitiveArrayType = string[] | number[] | boolean[];

export type UserInfo = {
  id: number;
  jwt: string;
};
export type UserRequest = Request & { user: UserInfo };
