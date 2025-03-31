import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaModule } from '@/common/infrastructure/prisma/prisma.module';
import { RabbitMQModule } from '@/common/infrastructure/rabbitmq/rabbitmq.module';

@Module({
  imports: [PrismaModule, RabbitMQModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
