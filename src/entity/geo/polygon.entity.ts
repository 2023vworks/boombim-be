import { Column, Entity, Polygon } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { RegionType } from '../enum';

@Entity('polygon_info')
export class PolygonInfoEntity extends BaseEntity {
  @Column('varchar', { comment: '시 구 동 이름' })
  addressPart: string;

  @Column('varchar', { comment: '시 이름' })
  city: string;

  @Column('varchar', { comment: '구 이름' })
  gu: string;

  @Column('varchar', { comment: '동 이름' })
  dong: string;

  @Column('enum', {
    enum: RegionType,
    comment: 'H(행정동) 또는 B(법정동)',
    default: 'H',
  })
  regionType: RegionType;

  @Column('geometry', { srid: 4326 })
  polygon: Polygon;
}
