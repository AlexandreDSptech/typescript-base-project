import { CrudController } from "../../core/crud/crud-controller";
import { CrudUseCase } from "../../core/crud/crud-use-case";
import { Person } from "./person-entity";
import { PersonRepository } from "./person-repository";

export class PersonController extends CrudController<Person, string> {
  constructor() {
    super(new PersonRepository())
  }
}