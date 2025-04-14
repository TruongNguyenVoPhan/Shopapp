import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProductDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    price: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    category_id: number;

    constructor(data: any) {
        this.name = data.name;
        this.price = data.price;
        this.description = data.description;
        this.category_id = data.category_id;
    }
}
