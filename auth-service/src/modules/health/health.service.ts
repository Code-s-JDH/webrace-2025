// src/health/health.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/common/infrastructure/prisma/prisma.service';
import { RabbitMQService } from '@/common/infrastructure/rabbitmq/rabbitmq.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database check failed', error);
      return false;
    }
  }

  async checkRabbitMQ(): Promise<boolean> {
    try {
      const client = this.rabbitMQService.getClient();
      return !!client;
    } catch (error) {
      this.logger.error('RabbitMQ check failed', error);
      return false;
    }
  }

  async checkServer(): Promise<boolean> {
    return true;
  }

  async checkHealth(): Promise<{
    server: boolean;
    database: boolean;
    rabbitmq: boolean;
  }> {
    const [serverStatus, dbStatus, rabbitmqStatus] = await Promise.all([
      this.checkServer(),
      this.checkDatabase(),
      this.checkRabbitMQ(),
    ]);

    return {
      server: serverStatus,
      database: dbStatus,
      rabbitmq: rabbitmqStatus,
    };
  }
}


