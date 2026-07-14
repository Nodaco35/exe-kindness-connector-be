import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { Book } from '../book/entities/book.entity';
import { Membership } from '../membership/entities/membership.entity';
import { Exchange } from '../exchange/entities/exchange.entity';
import { Status_ACTIVE_LOCKED, Book_Status, Exchange_Status } from '../../common/enums/status.enum';
import { UserRole } from '../../common/enums/role.enum';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
    @InjectModel(Membership.name) private membershipModel: Model<Membership>,
    @InjectModel(Exchange.name) private exchangeModel: Model<Exchange>,
    private mailService: MailService,
  ) { }

  async getDashboardStats() {
    this.logger.log('=== Đang truy vấn số liệu thống kê Dashboard ===');

    this.logger.log('Truy vấn: db.users.countDocuments({ role: { $ne: "ADMIN" } }) để lấy tổng số người dùng');
    const totalUsers = await this.userModel.countDocuments({ role: { $ne: UserRole.ADMIN } });

    this.logger.log('Truy vấn: db.books.countDocuments({ status: "AVAILABLE" }) để lấy tổng số sách available');
    const totalBooks = await this.bookModel.countDocuments({ status: Book_Status.AVAILABLE });

    this.logger.log('Truy vấn: db.exchanges.countDocuments() để lấy tổng số giao dịch');
    const totalExchanges = await this.exchangeModel.countDocuments();

    this.logger.log('Truy vấn: db.users.countDocuments({ role: { $ne: "ADMIN" }, isPremium: true }) để lấy tổng người dùng Premium');
    const totalPremiumUsers = await this.userModel.countDocuments({ role: { $ne: UserRole.ADMIN }, isPremium: true });

    this.logger.log('Truy vấn aggregate: db.memberships.aggregate(...) để tính tổng doanh thu từ Membership');
    const totalRevenueResult = await this.membershipModel.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    this.logger.log('Truy vấn: db.users.countDocuments({ role: { $ne: "ADMIN" }, status: "ACTIVE" })');
    const activeUsers = await this.userModel.countDocuments({ role: { $ne: UserRole.ADMIN }, status: Status_ACTIVE_LOCKED.ACTIVE });

    this.logger.log('Truy vấn: db.users.countDocuments({ role: { $ne: "ADMIN" }, status: "LOCKED" })');
    const lockedUsers = await this.userModel.countDocuments({ role: { $ne: UserRole.ADMIN }, status: Status_ACTIVE_LOCKED.LOCKED });

    this.logger.log('Truy vấn: db.books.countDocuments({ status: "AVAILABLE" })');
    const availableBooks = await this.bookModel.countDocuments({ status: Book_Status.AVAILABLE });

    this.logger.log('Truy vấn: db.books.countDocuments({ status: "REQUESTED" })');
    const requestedBooks = await this.bookModel.countDocuments({ status: Book_Status.REQUESTED });

    this.logger.log('Truy vấn: db.books.countDocuments({ status: "EXCHANGED" })');
    const exchangedBooks = await this.bookModel.countDocuments({ status: Book_Status.EXCHANGED });

    this.logger.log('Truy vấn: db.books.countDocuments({ status: "HIDDEN" })');
    const hiddenBooks = await this.bookModel.countDocuments({ status: Book_Status.HIDDEN });

    // Safe Top Viewed Books query
    this.logger.log('Truy vấn: db.books.find().sort({ viewCount: -1 }).limit(5) để lấy danh sách sách xem nhiều nhất');
    let topViewedBooks: any[] = [];
    try {
      topViewedBooks = await this.bookModel
        .find()
        .sort({ viewCount: -1 })
        .limit(5)
        .populate('owner', 'fullName email')
        .exec();
    } catch (e) {
      this.logger.error('Lỗi khi truy vấn sách xem nhiều nhất:', e);
    }

    // Safe Category Breakdown query
    this.logger.log('Truy vấn aggregate: db.books.aggregate(...) để thống kê thể loại sách');
    let categoryBreakdown: any[] = [];
    try {
      categoryBreakdown = await this.bookModel.aggregate([
        { $project: { categories: { $cond: { if: { $isArray: '$categories' }, then: '$categories', else: [] } } } },
        { $unwind: { path: '$categories', preserveNullAndEmptyArrays: false } },
        { $group: { _id: '$categories', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 }
      ]);
    } catch (e) {
      this.logger.error('Lỗi khi thống kê thể loại sách:', e);
    }

    this.logger.log('=== Hoàn tất truy vấn số liệu thống kê Dashboard ===');

    return {
      totalUsers,
      totalBooks,
      totalExchanges,
      totalPremiumUsers,
      totalRevenue,
      userStatus: {
        active: activeUsers,
        locked: lockedUsers
      },
      bookStatus: {
        available: availableBooks,
        requested: requestedBooks,
        exchanged: exchangedBooks,
        hidden: hiddenBooks
      },
      topViewedBooks,
      categoryBreakdown
    };
  }

  async getAllUsers() {
    return this.userModel.find().select('-password').sort({ createdAt: -1 });
  }

  async getAllBooks() {
    return this.bookModel
      .find()
      .populate('owner', 'fullName email')
      .sort({ createdAt: -1 });
  }

  async getAllMemberships() {
    return this.membershipModel.find().populate('user', 'fullName email').sort({ createdAt: -1 });
  }

  async getAllExchanges() {
    return this.exchangeModel
      .find()
      .populate('owner', 'fullName email')
      .populate('requester', 'fullName email')
      .populate('book', 'title')
      .sort({ createdAt: -1 });
  }

  async updateUserStatus(id: string, status: Status_ACTIVE_LOCKED) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateBookStatus(id: string, status: Book_Status) {
    const book = await this.bookModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async sendTestEmail(email: string, message: string) {
    await this.mailService.sendNotificationEmail(
      email,
      'ADMIN_MESSAGE',
      'Admin gửi cho bạn tin nhắn',
      message
    );
    return { success: true, message: 'Email sent successfully' };
  }
}
