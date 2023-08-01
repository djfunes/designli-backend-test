import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailParserController } from './controllers/mail-parser.controller';
import { MailParserService } from './services/mail-parser.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AppController, MailParserController],
  providers: [AppService, MailParserService],
})
export class AppModule {}
