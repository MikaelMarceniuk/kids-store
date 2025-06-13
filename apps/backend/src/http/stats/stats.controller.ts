import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { StatusService } from './stats.service';

@UseGuards(RoleGuard(['ADMIN']))
@UseGuards(JwtGuard)
@Controller('stats')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get('sales-per-day')
  async getSalesPerDay() {
    return await this.statusService.getSalesPerDay();
  }

  @Get('top-customers-by-volume')
  async topCustomerByVolume() {
    return await this.statusService.topCustomersByVolume();
  }

  @Get('top-customers-by-average-sale')
  async topCustomerByAverageSale() {
    return await this.statusService.topCustomersByAverageSale();
  }

  @Get('top-customers-by-purchase-frequency')
  async topCustomerByPurchaseFrequency() {
    return await this.statusService.topCustomersByPurchaseFrequency();
  }
}
