import { CrudController } from '../../core/crud/crud-controller'
import { Person } from './person-entity'
import { personOrm } from './person-orm'
import { PersonRepository } from './person-repository'

export class PersonController extends CrudController<Person, string> {
  constructor () {
    super(new PersonRepository(), personOrm)
  }
}
