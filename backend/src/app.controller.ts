import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { VoucherService } from './voucher.service';

@Controller('api')
export class AppController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('check')
  @HttpCode(HttpStatus.OK)
  async checkVoucher(
    @Body() body: { flightNumber: string; date: string }
  ): Promise<{ exists: boolean }> {
    const exists = await this.voucherService.checkVoucherExists(
      body.flightNumber,
      body.date
    );
    return { exists };
  }

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generateVoucher(
    @Body() body: {
      name: string;
      id: string;
      flightNumber: string;
      date: string;
      aircraft: string;
    }
  ): Promise<{ success: boolean; seats: string[] }> {
    // First check if vouchers already exist for this flight and date
    const exists = await this.voucherService.checkVoucherExists(
      body.flightNumber,
      body.date
    );

    if (exists) {
      return { success: false, seats: [] };
    }

    // Generate 3 unique random seats based on aircraft type
    const seats = this.voucherService.generateSeats(body.aircraft);

    // Create the voucher record in database
    await this.voucherService.createVoucher(
      body.name,
      body.id,
      body.flightNumber,
      body.date,
      body.aircraft,
      seats
    );

    return { success: true, seats };
  }
}
