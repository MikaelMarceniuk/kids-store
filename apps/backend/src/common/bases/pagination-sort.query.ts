import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationSortQuery {
  @IsOptional()
  @IsEnum(SortOrder)
  sort?: SortOrder;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  limit?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  offset?: number;
}
