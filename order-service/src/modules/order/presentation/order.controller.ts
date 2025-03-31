import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { OrderService } from '../app/order.service';
import { CreateOrderDto } from '../app/dtos/create-order.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('order')
@Controller({ version: '2', path: 'orders' })
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Vytvoření nové objednávky' })
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      example1: {
        summary: 'Příklad objednávky',
        value: {
          title: 'Zásilka s oblečením',
          description: 'Trička a kalhoty pro klienta',
          status: 'pending',
          userId: 'uuid-user',
          estimatedTime: '2025-04-01T12:00:00.000Z',
          courierId: 'uuid-courier',
          address: 'Karlovo náměstí 5, Praha',
          postal: '12000',
          gps: '50.0755,14.4378',
          weight: 2.5,
          size: 'M',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Objednávka byla vytvořena' })
  @ApiResponse({ status: 400, description: 'Neplatná vstupní data' })
  async create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Získat objednávku podle ID' })
  @ApiParam({ name: 'id', required: true, description: 'UUID objednávky' })
  @ApiResponse({ status: 200, description: 'Objednávka nalezena' })
  @ApiResponse({ status: 404, description: 'Objednávka nenalezena' })
  async findById(@Param('id') id: string) {
    return this.orderService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Získat všechny objednávky' })
  @ApiResponse({ status: 200, description: 'Seznam objednávek' })
  async findAll() {
    return this.orderService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Smazat objednávku' })
  @ApiParam({ name: 'id', required: true, description: 'UUID objednávky' })
  @ApiResponse({ status: 204, description: 'Objednávka smazána' })
  @ApiResponse({ status: 404, description: 'Objednávka nenalezena' })
  async delete(@Param('id') id: string) {
    return this.orderService.delete(id);
  }
}
