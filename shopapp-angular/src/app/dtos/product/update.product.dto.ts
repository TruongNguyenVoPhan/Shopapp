import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProductDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    price: number;

    @IsNumber()
    quantity: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    category_id: number;
    

    constructor(data: any) {
        this.name = data.name;
        this.price = data.price;
        this.quantity = data.quantity;
        this.description = data.description;
        this.category_id = data.category_id;
    }
}
