import { PaginationDto } from "../types/pagination";
import { CrudRepository } from "./crud-repository-interface";
import { CrudUseCase } from "./crud-use-case";
import { IncomingHttpHeaders } from "http";
import { GetEnv } from "../utils/get-env";

export class CrudController <T, ID> {
  private readonly useCase: CrudUseCase<T, ID>

  constructor(repository: CrudRepository<T, ID>) {
    const useCase = new CrudUseCase<T, ID>(repository)
    this.useCase = useCase
  }

  async insert(item: T, headers?: IncomingHttpHeaders): Promise<T> {
    const env = GetEnv.getEnv(headers);
    return await this.useCase.insert(item, env);
  }

  async findById(id: ID, headers?: IncomingHttpHeaders): Promise<T | null> {
    const env = GetEnv.getEnv(headers);
    return await this.useCase.findById(id, env);
  }

  async find(filter: Partial<T> & PaginationDto, headers?: IncomingHttpHeaders): Promise<T> {
    const env = GetEnv.getEnv(headers);
    return await this.useCase.find(filter, env);
  }

  async findAll(filter: Partial<T> & PaginationDto, headers?: IncomingHttpHeaders): Promise<Array<T>> {
    const env = GetEnv.getEnv(headers);
    return await this.useCase.findAll(filter, env);
  }

  async update(id: ID, item: Partial<T>, headers?: IncomingHttpHeaders): Promise<T> {
    const env = GetEnv.getEnv(headers);
    return await this.useCase.update(id, item, env);
  }

  async delete(id: ID, headers?: IncomingHttpHeaders): Promise<void> {
    const env = GetEnv.getEnv(headers);
    await this.useCase.delete(id, env);
  }
}