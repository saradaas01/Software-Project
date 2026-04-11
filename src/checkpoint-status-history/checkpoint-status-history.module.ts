import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckpointStatusHistoryService } from './checkpoint-status-history.service';
import { CheckpointStatusHistory } from './checkpoint-status-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CheckpointStatusHistory])],
  providers: [CheckpointStatusHistoryService],
  exports: [CheckpointStatusHistoryService],
})
export class CheckpointStatusHistoryModule {}