import { Injectable, Inject } from '@nestjs/common';
import { IOrderRepository } from '../domain/order.repository';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order } from '../domain/order.entity';
import { UuidGenerator } from '@/common/infrastructure/service/uuid-generator.service';

@Injectable()
export class OrderService {
  constructor(
    @Inject('IOrderRepository') private readonly orderRepo: IOrderRepository,
    @Inject(UuidGenerator) private readonly uuidGenerator: UuidGenerator,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = new Order(
      this.uuidGenerator.generate(),
      dto.title,
      dto.description,
      dto.status,
      dto.userId,
      dto.estimatedTime,
      dto.courierId,
      dto.address,
      dto.postal,
      dto.gps,
      dto.weight,
      dto.size,
    );
    return this.orderRepo.create(order);
  }

  async findById(id: string): Promise<Order | null> {
    return this.orderRepo.getById(id);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepo.getAll();
  }

  async delete(id: string): Promise<void> {
    return this.orderRepo.delete(id);
  }
}
