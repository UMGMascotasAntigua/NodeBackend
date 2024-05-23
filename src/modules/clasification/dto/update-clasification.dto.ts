import { PartialType } from '@nestjs/mapped-types';
import { CreateClasificationDto } from './create-clasification.dto';

export class UpdateClasificationDto extends PartialType(CreateClasificationDto) {}
