import { Module } from '@nestjs/common';
import { ExampleService } from './example.service';

@Module({
  imports: [],
  providers: [ExampleService],
  controllers: [],
})
export class ExampleModule {}
