import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CorsConfig implements CorsOptions {
  @IsNotEmpty()
  @Transform(({ value }) => (value === 'true' ? true : value))
  origin: boolean | string;
}
