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
  @Get('qr-info')
  getQrInfo(@Req() req: any) {
    return this.membershipService.getQrInfo(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('env-config')
  getEnvConfig() {
    return this.membershipService.getEnvConfig();
  }

  /**
   * Webhook endpoint cho SePay (KHÔNG xác thực)
   * URL: POST /membership/sepay-webhook
   */
  @Post('sepay-webhook')
  @HttpCode(200)  // BẮT BUỘC: SePay yêu cầu HTTP 200
  async sepayWebhook(@Body() body: any) {
    // Log để debug
    this.logger.log('📨 Webhook received at:', new Date().toISOString());
    this.logger.log('📦 Payload:', JSON.stringify(body, null, 2));

    try {
      // Xử lý webhook
      const result = await this.membershipService.handleSePayWebhook(body);
      this.logger.log('✅ Webhook processed:', result);

      // Luôn trả về đúng format SePay yêu cầu
      return { success: true };

    } catch (error) {
      // KHÔNG throw lỗi, vẫn trả về 200 để SePay không retry
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