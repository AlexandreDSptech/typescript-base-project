import { PaginationDto, PaginationResponseDto } from "../types/pagination"

export interface CrudRepository<T, ID> {
  insert(item: T): Promise<T>
  findById(id: ID): Promise<T | null>
  find(filter: Partial<T> & PaginationDto): Promise<T>
  findAll(filter: Partial<T> & PaginationDto): Promise<Array<T>>
  update(id: ID, item: Partial<T>): Promise<T>
  delete(id: ID): Promise<void>
  query<Q>(query: Object | Array<any> | string): Promise<Q>
}