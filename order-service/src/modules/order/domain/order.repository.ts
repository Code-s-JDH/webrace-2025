// src/modules/order/domain/order.repository.interface.ts

import { Order } from './order.entity';

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  getById(id: string): Promise<Order | null>;
  getAll(): Promise<Order[]>;
  delete(id: string): Promise<void>;
}
