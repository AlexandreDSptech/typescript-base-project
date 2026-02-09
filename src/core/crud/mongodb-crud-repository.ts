import { Collection, ObjectId, Filter, Document } from 'mongodb';
import MongoDBConnection from '../../infrastructure/db/mongodb/mongodb-connection';
import { CrudRepository } from "./crud-repository-interface";
import { PaginationDto } from "../types/pagination";

export class MongodbCrudRepository<T extends Document, ID> implements CrudRepository<T, ID> {
  private collection: Collection<T>;

  constructor(private readonly collectionName: string) {
    const db = MongoDBConnection.getInstance().getDatabase();
    this.collection = db.collection<T>(this.collectionName);
  }

  async insert(item: T): Promise<T> {
    const result = await this.collection.insertOne(item as any);
    return { ...item, _id: result.insertedId } as T;
  }

  async findById(id: ID): Promise<T | null> {
    const filter = { _id: new ObjectId(id as string) } as Filter<T>;
    const result = await this.collection.findOne(filter);
    return result as T | null;
  }

  private async executeFind(filter: Partial<T> & PaginationDto): Promise<T[]> {
    const { page = 1, size = 10, orderBy, orderDirection = 'asc', createdAtDirection, ...queryFilter } = filter;
    
    const skip = (page - 1) * size;
    const sort: any = {};
    
    if (orderBy) {
      sort[orderBy] = orderDirection === 'asc' ? 1 : -1;
    }
    
    if (createdAtDirection) {
      sort.createdAt = createdAtDirection === 'asc' ? 1 : -1;
    }

    const result = await this.collection
      .find(queryFilter as Filter<T>)
      .sort(sort)
      .skip(skip)
      .limit(size)
      .toArray();

    return result as T[];
  }

  async find(filter: Partial<T> & PaginationDto): Promise<T> {
    const result = await this.executeFind(filter);
    return result[0] as T;
  }

  async findAll(filter: Partial<T> & PaginationDto): Promise<Array<T>> {
    return await this.executeFind(filter);
  }

  async update(id: ID, item: Partial<T>): Promise<T> {
    const filter = { _id: new ObjectId(id as string) } as Filter<T>;
    const updateDoc = { $set: item };
    
    const result = await this.collection.findOneAndUpdate(
      filter,
      updateDoc,
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error(`Item com id ${id} não encontrado`);
    }

    return result as T;
  }

  async delete(id: ID): Promise<void> {
    const filter = { _id: new ObjectId(id as string) } as Filter<T>;
    const result = await this.collection.deleteOne(filter);
    
    if (result.deletedCount === 0) {
      throw new Error(`Item com id ${id} não encontrado`);
    }
  }

  async query<Q>(query: Object | Array<any> | string): Promise<Q> {
    // Se for um array, trata como aggregation pipeline
    if (Array.isArray(query)) {
      const result = await this.collection.aggregate(query).toArray();
      return result as Q;
    }
    
    // Se for um objeto, trata como filtro de find
    if (typeof query === 'object' && query !== null) {
      const result = await this.collection.find(query as Filter<T>).toArray();
      return result as Q;
    }
    
    // Se for string, tenta parsear como JSON e executar
    if (typeof query === 'string') {
      try {
        const parsedQuery = JSON.parse(query);
        if (Array.isArray(parsedQuery)) {
          const result = await this.collection.aggregate(parsedQuery).toArray();
          return result as Q;
        }
        const result = await this.collection.find(parsedQuery as Filter<T>).toArray();
        return result as Q;
      } catch (error) {
        throw new Error('Query string inválida. Deve ser um JSON válido.');
      }
    }
    
    throw new Error('Tipo de query não suportado');
  }
}