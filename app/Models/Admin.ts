import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Admin extends BaseModel {
  public static table = 'admin'

  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public status: number

  @column()
  public role: number

  @column.dateTime({ autoUpdate: true })
  public lastLogin: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public registeredAt: DateTime
}
