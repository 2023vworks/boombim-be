import { StringValidator, StringValidatorOptional } from '@app/common';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { AdminEntiy } from './admin.entity';

@Entity('http_request_history')
export class HttpRequestHistoryEntiy extends BaseEntity {
  @ApiHideProperty()
  @Exclude()
  @StringValidator({ maxLength: 10 })
  @Column('varchar', { comment: 'HTTP Method', length: 10 })
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

  @ApiHideProperty()
  @Exclude()
  @StringValidator({ maxLength: 300 })
  @Column('varchar', { comment: 'HTTP Url', length: 300 })
  httpUrl: string;

  @ApiHideProperty()
  @Exclude()
  @StringValidatorOptional()
  @Column('text', { comment: 'HTTP Body', nullable: true })
  httpBody?: string | null;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => AdminEntiy, (admin) => admin.httpRequestHistories, {
    nullable: false,
  })
  admin: AdminEntiy;
}
