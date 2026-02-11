import { Aurora } from '../../core/aurora/lib/aurora'
import { ORM } from '../../core/aurora/types'

const aurora = new Aurora(ORM.MONGO)

export const personOrm = aurora.object({
  name: aurora.string(),
  age: aurora.number(),
})
