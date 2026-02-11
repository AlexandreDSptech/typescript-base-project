import { Entity } from '../../core/types/entity'
import { personOrm } from './person-validator'

export type Person = ReturnType<typeof personOrm.getType> & Entity
