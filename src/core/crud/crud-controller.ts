import { PaginationDto } from '../types/pagination'
import { CrudRepository } from './crud-repository-interface'
import { CrudUseCase } from './crud-use-case'
import { IncomingHttpHeaders } from 'http'
import { GetEnv } from '../utils/get-env'
import { ObjectField } from '../aurora/core'
import { Field } from '../aurora/interfaces/field'
import { NotFoundError } from '../errors/core/not-found-error'
import { Resource } from '../types/resource'

export class CrudController <T extends Record<string, Field>, ID = any> {
  private readonly useCase: CrudUseCase<T, ID>

  constructor (
    private readonly repository: CrudRepository<T, ID>,
    private readonly orm: ObjectField<T>,
  ) {
    const useCase = new CrudUseCase<T, ID>(this.repository)
    this.useCase = useCase
  }

  async insert (item: T, headers?: IncomingHttpHeaders): Promise<T> {
    const env = GetEnv.getEnv(headers)

    this.orm.validate(item)

    return await this.useCase.insert(item, env)
  }

  async findById (id: ID, headers?: IncomingHttpHeaders): Promise<T | null> {
    const env = GetEnv.getEnv(headers)
    const result = await this.useCase.findById(id, env)
    if (!result) {
      throw new NotFoundError(Resource.Person, id)
    }

    return result
  }

  async find (filter: Partial<T> & PaginationDto, headers?: IncomingHttpHeaders): Promise<T> {
    const env = GetEnv.getEnv(headers)
    return await this.useCase.find(filter, env)
  }

  async findAll (filter: Partial<T> & PaginationDto, headers?: IncomingHttpHeaders): Promise<Array<T>> {
    const env = GetEnv.getEnv(headers)
    return await this.useCase.findAll(filter, env)
  }

  async update (id: ID, item: Partial<T>, headers?: IncomingHttpHeaders): Promise<T> {
    const env = GetEnv.getEnv(headers)

    this.orm.validate(item)

    return await this.useCase.update(id, item, env)
  }

  async delete (id: ID, headers?: IncomingHttpHeaders): Promise<void> {
    const env = GetEnv.getEnv(headers)
    await this.useCase.delete(id, env)
  }
}
