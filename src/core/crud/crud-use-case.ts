import { CrudRepository } from "./crud-repository-interface";
import { PaginationDto } from "../types/pagination";

export class CrudUseCase<T, ID> {
  constructor(private readonly repository: CrudRepository<T, ID>) {}

  async insert(item: T): Promise<T> {
    return await this.repository.insert(item);
  }

  async findById(id: ID): Promise<T | null> {
    return await this.repository.findById(id);
  }

  async find(filter: Partial<T> & PaginationDto): Promise<T> {
    return await this.repository.find(filter);
  }

  async findAll(filter: Partial<T> & PaginationDto): Promise<Array<T>> {
    const response = await this.repository.findAll(filter);
    return response;
  }

  async update(id: ID, item: Partial<T>): Promise<T> {
    return await this.repository.update(id, item);
  }

  async delete(id: ID): Promise<void> {
    await this.repository.delete(id);
  }

  async query<Q>(query: Object | Array<any> | string): Promise<Q> {
    return await this.repository.query<Q>(query);
  }
}