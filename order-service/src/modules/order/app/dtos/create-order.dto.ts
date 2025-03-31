import { IsNotEmpty, IsOptional, IsString, IsNumber, IsUUID, IsDateString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsUUID()
  userId: string;

  @IsOptional()
  @IsDateString()
  estimatedTime?: string;

  @IsOptional()
  @IsUUID()
  courierId?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  postal?: string;

  @IsOptional()
  @IsString()
  gps?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  size?: string;
}
