import { CursorPaginationDTO } from '@app/common';
import { ApiHideProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class GetFeedCommentsRequestDTO extends CursorPaginationDTO {
  @ApiHideProperty()
  @IsOptional()
  @Expose()
  readonly sort = 'ASC';
}
