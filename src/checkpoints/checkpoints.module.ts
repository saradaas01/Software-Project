import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckpointsController } from './checkpoints.controller';
import { CheckpointsService } from './checkpoints.service';
import { Checkpoint } from './checkpoint.entity';
import { CheckpointStatusHistoryModule } from '../checkpoint-status-history/checkpoint-status-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Checkpoint]),
    CheckpointStatusHistoryModule,
  ],
  controllers: [CheckpointsController],
  providers: [CheckpointsService],
})
export class CheckpointsModule {}