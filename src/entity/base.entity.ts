import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @ApiProperty({ description: '엔티티 id', type: Number })
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '생성일', type: Date })
  @Expose()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ description: '수정일', type: Date })
  @Expose()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ApiHideProperty()
  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;
}
