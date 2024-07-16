import { IsString } from "@nestjs/class-validator";

export class EmailValidationSignUpRequestDto {
  /**
   *     to?: string | Address | Array<string | Address>;
    replyTo?: string | Address | Array<string | Address>;
    inReplyTo?: string | Address;
    from?: string | Address;
    subject?: string;
    text?: string | Buffer | AttachmentLikeObject;
    html?: string | Buffer;
    sender?: string | Address;
    raw?: string | Buffer;
    textEncoding?: TextEncoding;
    references?: string | string[];
    encoding?: string;
    date?: Date | string;
    headers?: Headers;
    context?: {
        [name: string]: any;
    };
    transporterName?: string;
    template?: string;
    attachments?: Attachment[];
    dkim?: DKIM.Options;
   */
  @IsString()
  to: string
}