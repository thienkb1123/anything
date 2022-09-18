import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Media extends BaseModel {
  public static table = 'media'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public typeOfFile: string

  @column()
  public type: string

  @column()
  public size: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
