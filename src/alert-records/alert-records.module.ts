import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertRecordsService } from './alert-records.service';
import { AlertRecord } from './alert-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlertRecord])],
  providers: [AlertRecordsService],
  exports: [AlertRecordsService],
})
export class AlertRecordsModule {}