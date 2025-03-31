// src/modules/order/infrastructure/order.repository.ts

import { Injectable, Inject } from '@nestjs/common';
import { IOrderRepository } from '../domain/order.repository';
import { Order } from '../domain/order.entity';
import { IPrismaClient } from '@/common/interfaces/prisma-client.interface';
import { OrderMapper } from './order.mapper';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @Inject('IPrismaClient') private readonly prisma: IPrismaClient,
  ) {}

  async create(order: Order): Promise<Order> {
    const raw = await this.prisma.order.create({
      data: OrderMapper.toPrisma(order),
    });
    return OrderMapper.fromPrisma(raw);
  }

  async getById(id: string): Promise<Order | null> {
    const raw = await this.prisma.order.findUnique({ where: { id } });
    return raw ? OrderMapper.fromPrisma(raw) : null;
  }

  async getAll(): Promise<Order[]> {
    const raw = await this.prisma.order.findMany();
    return OrderMapper.fromPrismaMany(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.order.delete({ where: { id } });
  }
}
