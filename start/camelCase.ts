import { string } from '@ioc:Adonis/Core/Helpers'
import { BaseModel } from '@ioc:Adonis/Lucid/Orm'

BaseModel.namingStrategy.serializedName = (_, key) => {
  return string.camelCase(key)
}
