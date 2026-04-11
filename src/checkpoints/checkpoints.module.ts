import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckpointsController } from './checkpoints.controller';
import { CheckpointsService } from './checkpoints.service';
import { Checkpoint } from './checkpoint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Checkpoint])],
  controllers: [CheckpointsController],
  providers: [CheckpointsService],
})
export class CheckpointsModule {}