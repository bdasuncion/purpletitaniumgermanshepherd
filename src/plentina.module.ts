import { Module } from '@nestjs/common'
import { PlentinaController } from './plentina.controller'
import { PlentinaService } from './plentina.service'

@Module({
  imports: [],
  controllers: [PlentinaController],
  providers: [PlentinaService],
})
export class AppModule {}
