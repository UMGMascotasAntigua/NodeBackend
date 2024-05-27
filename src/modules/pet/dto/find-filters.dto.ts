import { IsNotEmpty, IsString } from "class-validator";

export class FilterDto{

    @IsString()
    field: string;

    operator: string;

    @IsString()
    @IsNotEmpty()
    value: string;
}

export class FiltersDto{
    filters: FilterDto[];
}