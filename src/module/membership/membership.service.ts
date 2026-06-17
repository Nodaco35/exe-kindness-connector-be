import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Membership } from './entities/membership.entity';
import { User } from '../user/entities/user.entity';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';

@Injectable()
export class MembershipService {
  constructor(
    @InjectModel(Membership.name) private readonly membershipModel: Model<Membership>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getQrInfo(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const bankAccount = process.env.SEPAY_BANK_ACCOUNT || '0964405117';
    const bankName = process.env.SEPAY_BANK_NAME || 'MBBank';
    const amount = Number(process.env.MEMBERSHIP_PRICE) || 5000;
    const description = `KINDNESS${userId}`;

    // Generate QR code using SePay API
    const qrUrl = `https://qr.sepay.vn/img?acc=${bankAccount}&bank=${bankName}&amount=${amount}&des=${description}`;

    return {
      bankAccount,
      bankName,
      amount,
      description,
      qrUrl,
    };
  }

  async handleSepayWebhook(payload: any) {
    console.log('Received SePay Webhook:', JSON.stringify(payload, null, 2));

    if (!payload || payload.transferType !== 'in') {
      return { success: false, message: 'Invalid transaction type or empty payload' };
    }

    const { content, transferAmount, id } = payload;
    if (!content) {
      return { success: false, message: 'Transaction content is empty' };
    }

    // Match KINDNESS followed by the MongoDB ObjectId (24 hex characters)
    const match = content.match(/KINDNESS([a-f\d]{24})/i);
    if (!match) {
      return { success: false, message: 'User ID not found in transaction content' };
    }

    const userId = match[1];
    const user = await this.userModel.findById(userId);
    if (!user) {
      return { success: false, message: `User with ID ${userId} not found` };
    }

    const requiredPrice = Number(process.env.MEMBERSHIP_PRICE) || 5000;
    if (transferAmount < requiredPrice) {
      return { success: false, message: `Insufficient amount. Expected ${requiredPrice}, got ${transferAmount}` };
    }

    // Check if this transaction has already been processed (avoid replay attacks)
    const existingMembership = await this.membershipModel.findOne({ transactionId: String(id) });
    if (existingMembership) {
      return { success: true, message: 'Transaction already processed' };
    }

    // Update user premium status
    user.isPremium = true;
    await user.save();

    // Create a Membership record
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30); // 30 days of membership

    const newMembership = new this.membershipModel({
      user: user._id,
      startDate,
      endDate,
      status: 'ACTIVE',
      method: 'ONLINE',
      transactionId: String(id),
      amount: transferAmount,
    });
    await newMembership.save();

    return { success: true, message: 'Membership updated successfully' };
  }

  create(createMembershipDto: CreateMembershipDto) {
    return 'This action adds a new membership';
  }

  findAll() {
    return `This action returns all membership`;
  }

  findOne(id: number) {
    return `This action returns a #${id} membership`;
  }

  update(id: number, updateMembershipDto: UpdateMembershipDto) {
    return `This action updates a #${id} membership`;
  }

  remove(id: number) {
    return `This action removes a #${id} membership`;
  }
}
