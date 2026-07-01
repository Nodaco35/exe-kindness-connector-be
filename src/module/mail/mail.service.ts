import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendNotificationEmail(
    emailTo: string,
    type: string,
    title: string,
    message: string,
    url?: string,
  ): Promise<void> {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      // If the url is relative, prepend frontendUrl
      const redirectUrl =
        url && url.startsWith('/')
          ? `${frontendUrl}${url}`
          : url || frontendUrl;

      let template = '';
      let subject = title;

      switch (type) {
        case 'BOOK_REQUEST':
          template = './book-request';
          break;
        case 'CHAT_MESSAGE':
          template = './chat-message';
          break;
        case 'ADMIN_MESSAGE':
          template = './admin-message';
          break;
        default:
          // Do not send email for unknown types
          this.logger.warn(`No email template for notification type: ${type}`);
          return;
      }

      await this.mailerService.sendMail({
        to: emailTo,
        subject: subject,
        template: template,
        context: {
          title,
          message,
          redirectUrl,
        },
      });

      this.logger.log(`Email sent successfully to ${emailTo} for type ${type}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${emailTo}: ${error.message}`,
        error.stack,
      );
    }
  }
}
