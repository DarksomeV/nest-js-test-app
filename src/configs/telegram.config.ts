import { ConfigService } from '@nestjs/config';

import { TelegramOptions } from '../telegram/telegram.interface';

export const getTelegramConfig = (configService: ConfigService): TelegramOptions => {
  const token = configService.get('TELEGRAM_TOKEN');
  if (!token) {
    throw new Error('no telegram id');
  }

  return {
    token,
    chatId: configService.get('CHAT_ID') ?? ''
  };
};