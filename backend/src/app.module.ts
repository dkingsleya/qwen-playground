import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { VoucherService } from './voucher.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [VoucherService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly voucherService: VoucherService) {}

  async onModuleInit(): Promise<void> {
    await this.voucherService.initDatabase();
  }
}
