import { Global, Module } from '@nestjs/common';
import { BaseGateway } from './base.gateway';

@Global()
@Module({
  providers: [BaseGateway],
  exports: [BaseGateway],
})
export class BaseModule {}
