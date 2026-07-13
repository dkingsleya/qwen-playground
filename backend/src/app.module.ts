import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { VoucherService } from './voucher.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [VoucherService],
})
export class AppModule {}
