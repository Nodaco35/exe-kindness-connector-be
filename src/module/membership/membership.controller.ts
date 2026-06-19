// membership.controller.ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, Req, HttpCode, Logger
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('membership')
export class MembershipController {
  private readonly logger = new Logger(MembershipController.name);

  constructor(private readonly membershipService: MembershipService) { }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  createCheckout(@Req() req: any, @Body() body: any) {
    return this.membershipService.createCheckout(req.user.userId, body);
  }

  /**
   * Webhook endpoint cho SePay (KHÔNG xác thực)
   * URL: POST /membership/sepay-webhook
   */
  @Post('sepay-webhook')
  @HttpCode(200)  // BẮT BUỘC: SePay yêu cầu HTTP 200
  async sepayWebhook(@Body() body: any) {
    this.logger.log('📨 Webhook received at sepay-webhook:', new Date().toISOString());
    try {
      await this.membershipService.handleSePayWebhook(body);
      return { success: true };
    } catch (error: any) {
      this.logger.error('❌ Webhook error:', error.message);
      return { success: true, message: 'Error logged' };
    }
  }

  /**
   * Webhook endpoint cho local test giả lập từ frontend
   * URL: POST /membership/webhook/sepay
   */
  @Post('webhook/sepay')
  @HttpCode(200)
  async localWebhook(@Body() body: any) {
    this.logger.log('📨 Webhook received at webhook/sepay:', new Date().toISOString());
    try {
      await this.membershipService.handleSePayWebhook(body);
      return { success: true };
    } catch (error: any) {
      this.logger.error('❌ Webhook error:', error.message);
      return { success: true, message: 'Error logged' };
    }
  }

  @Post()
  create(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipService.create(createMembershipDto);
  }

  @Get()
  findAll() {
    return this.membershipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMembershipDto: UpdateMembershipDto) {
    return this.membershipService.update(+id, updateMembershipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membershipService.remove(+id);
  }
}