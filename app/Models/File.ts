import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'
import { FileCategory } from 'App/Utils'
import Env from '@ioc:Adonis/Core/Env'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fileName: string

  @column()
  public fileCategory: FileCategory

  @column()
  public ownerId: number

  @computed()
  public get url(): string {
    return `${Env.get('APP_URL')}/uploads/${this.fileName}`
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
