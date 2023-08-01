import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { MailParserService } from 'src/services/mail-parser.service';

@Controller('mail')
export class MailParserController {
  constructor(private mailService: MailParserService){}

  @Post('parse')
  @UseInterceptors(FileInterceptor('file'))
  async parseMail(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<any> {

    const filePath = file.path;
    const mail = await this.mailService.parseMailContent(filePath);
    const data = await this.mailService.extractJSON(mail);

    // Set the Content-Type header to "application/json"
    res.header('Content-Type', 'application/json');
    res.send(data);
  }

}
