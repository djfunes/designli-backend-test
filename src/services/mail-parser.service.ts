import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as mailparser from 'mailparser';
import * as fs from 'fs';
import axios from 'axios';

@Injectable()
export class MailParserService {
  async parseMailContent(filePath: string): Promise<any> {
    try {
      const emlFileContent = await fs.promises.readFile(filePath);

      const parsedMail = await mailparser.simpleParser(emlFileContent);

      return parsedMail;
    } catch (error) {
      throw new HttpException(
        'Error while parsing email content',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async extractJSON(mail: any): Promise<any> {
    let jsonData = null;
    try {
        //Check for attachments
      if (mail.attachments.length > 0) {
        const attachment = mail.attachments[0];
        jsonData = JSON.parse(attachment.content.toString());
      } else {
        //check for links
        const body = mail.text || mail.html;
        const linkRegex = /(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*\.(json)/g;
        const linkMatches = body.match(linkRegex);

        if (linkMatches && linkMatches.length > 0) {
          const jsonLink = linkMatches[0];
          const response = await axios.get(jsonLink);
          jsonData = response.data;
        } else {
            //check for JSON within the body
          const body = mail.text || mail.html;
          const jsonRegex = /(?:{[\s\S]*})/;
          const jsonMatch = body.match(jsonRegex);

          if (jsonMatch) {
            jsonData = JSON.parse(jsonMatch[0]);
          }
        }
      }
    } catch (error) {
      console.error(error);
      throw new HttpException('No JSON Content found', HttpStatus.BAD_REQUEST);
    }
    return jsonData;
  }
}
