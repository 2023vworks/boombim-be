import { Exclude } from 'class-transformer';
import { BaseEntity } from '../base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { BooleanValidator, DateValidator, StringValidator } from '@app/common';
import { HttpRequestHistoryEntiy } from './http-request-history.entity';

@Entity('admin')
export class AdminEntiy extends BaseEntity {
  @ApiHideProperty()
  @Exclude()
  @StringValidator({ maxLength: 50 })
  @Column('varchar', { comment: '관리자 닉네임', length: 50 })
  nickname: string;

  @ApiHideProperty()
  @Exclude()
  @StringValidator({ maxLength: 300 })
  @Column('varchar', { comment: '토큰', length: 300, default: 'admin' })
  token: string;

  @ApiHideProperty()
  @Exclude()
  @DateValidator()
  @Column('timestamptz', { comment: '마지막 접속일', default: () => 'NOW()' })
  accessedAt: Date;

  @ApiHideProperty()
  @Exclude()
  @BooleanValidator()
  @Column('boolean', { comment: '활성화 여부', default: false })
  isActived: boolean;

  @ApiHideProperty()
  @Exclude()
  @OneToMany(() => HttpRequestHistoryEntiy, (history) => history.admin, {
    nullable: true,
  })
  httpRequestHistories: HttpRequestHistoryEntiy[];
}
