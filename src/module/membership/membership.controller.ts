import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

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

  @Post('sepay-webhook')
  async sepayWebhook(@Body() body: any, @Req() req: any) {
    const authHeader = req.headers.authorization;
    const secretKey = process.env.SEPAY_MERCHANT_SECRET_KEY;
    if (secretKey) {
      if (authHeader !== `Bearer ${secretKey}`) {
        throw new UnauthorizedException('Invalid signature token');
      }
    }
    return this.membershipService.handleSepayWebhook(body);
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
