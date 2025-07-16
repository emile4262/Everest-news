import { Module } from '@nestjs/common';
import { ExternalContentService } from './external-content.service';
import { ExternalContentController } from './external-content.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExternalContentController],
  providers: [ExternalContentService],
  exports: [ExternalContentService],
})
export class ExternalContentModule {}