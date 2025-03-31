export class Order {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public status: string,
    public userId: string,
    public estimatedTime?: string,
    public courierId?: string,
    public address?: string,
    public postal?: string,
    public gps?: string,
    public weight?: number,
    public size?: string,
  ) {}
}
