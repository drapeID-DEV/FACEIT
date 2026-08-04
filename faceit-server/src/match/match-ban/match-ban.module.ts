import { Module } from '@nestjs/common';
import { MatchBanService } from './match-ban.service';
import { MatchBanController } from './match-ban.controller';

@Module({
  controllers: [MatchBanController],
  providers: [MatchBanService],
})
export class MatchBanModule {}
