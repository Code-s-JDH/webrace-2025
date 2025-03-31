import { Module } from '@nestjs/common';
import { OrderController } from './presentation/order.controller';
import { OrderService } from './app/order.service';
import { IOrderRepository } from './domain/order.repository';
import { OrderRepository } from './infrastructure/order.repository';
import { PrismaModule } from '@/common/infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    { provide: 'IOrderRepository', useClass: OrderRepository },
  ],
  exports: [OrderService],
})
export class OrderModule {}
