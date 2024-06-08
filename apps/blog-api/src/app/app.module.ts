import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';

@Module({
  imports: [ApiModule],
  providers: [],
})
export class AppModule {}
