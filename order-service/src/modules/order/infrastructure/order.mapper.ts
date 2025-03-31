import { Order } from '../domain/order.entity';
import { Order as PrismaOrder } from '@prisma/client';

export class OrderMapper {
  static fromPrisma(data: PrismaOrder): Order {
    return new Order(
      data.id,
      data.title,
      data.description,
      data.status,
      data.userId,
      data.estimatedTime ?? undefined,
      data.courierId ?? undefined,
      data.address ?? undefined,
      data.postal ?? undefined,
      data.gps ?? undefined,
      data.weight ?? undefined,
      data.size ?? undefined,
    );
  }

  static fromPrismaMany(data: PrismaOrder[]): Order[] {
    return data.map(OrderMapper.fromPrisma);
  }

  static toPrisma(entity: Order): PrismaOrder {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      userId: entity.userId,
      estimatedTime: entity.estimatedTime ?? null,
      courierId: entity.courierId ?? null,
      address: entity.address ?? null,
      postal: entity.postal ?? null,
      gps: entity.gps ?? null,
      weight: entity.weight ?? null,
      size: entity.size ?? null,
    };
  }
}
