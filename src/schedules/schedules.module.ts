import { Module } from '@nestjs/common';
import { ExampleModule } from './example/example.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), ExampleModule],
  controllers: [],
  providers: [],
})
export class SchedulesModules {}
