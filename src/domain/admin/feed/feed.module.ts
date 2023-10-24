import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeedEntity } from '@app/entity';
import { FeedController } from './feed.controller';
import { FeedServiceImpl, FeedServiceToken } from './feed.service';
import { FeedRepositoryImpl, FeedRepositoryToken } from './feed.repository';
import { AuthModule } from 'src/domain/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [FeedController],
  providers: [
    {
      provide: FeedServiceToken,
      useClass: FeedServiceImpl,
    },
    {
      provide: FeedRepositoryToken,
      useClass: FeedRepositoryImpl,
    },
  ],
  exports: [FeedServiceToken],
})
export class FeedModule {}
