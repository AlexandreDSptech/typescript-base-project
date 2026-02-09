import { PaginationDto } from "../types/pagination";
import { CrudRepository } from "./crud-repository-interface";
import { CrudUseCase } from "./crud-use-case";

export class CrudController <T, ID> {
  private readonly useCase: CrudUseCase<T, ID>

  constructor(repository: CrudRepository<T, ID>) {
    const useCase = new CrudUseCase<T, ID>(repository)
    this.useCase = useCase
  }

  async insert(item: T): Promise<T> {
    return await this.useCase.insert(item);
  }

  async findById(id: ID): Promise<T | null> {
    return await this.useCase.findById(id);
  }

  async find(filter: Partial<T> & PaginationDto): Promise<T> {
    return await this.useCase.find(filter);
  }

  async findAll(filter: Partial<T> & PaginationDto): Promise<Array<T>> {
    return await this.useCase.findAll(filter);
  }

  async update(id: ID, item: Partial<T>): Promise<T> {
    return await this.useCase.update(id, item);
  }

  async delete(id: ID): Promise<void> {
    await this.useCase.delete(id);
  }
}