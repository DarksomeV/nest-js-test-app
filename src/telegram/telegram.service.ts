import { Inject, Injectable } from '@nestjs/common';

import { Telegraf } from 'telegraf';

import { TelegramOptions } from './telegram.interface';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.constants';

@Injectable()
export class TelegramService {
  bot: Telegraf;
  options: TelegramOptions;

  constructor(
    @Inject(TELEGRAM_MODULE_OPTIONS) options: TelegramOptions,
  ) {
    this.options = options;
    this.bot = new Telegraf(options.token);
  }

  async sendMessage(message: string, chatId: string = this.options.chatId): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, message);
  }
}
