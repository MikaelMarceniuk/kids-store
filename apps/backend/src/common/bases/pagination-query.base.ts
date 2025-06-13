import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationQuery {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  limit?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  offset?: number;
}
