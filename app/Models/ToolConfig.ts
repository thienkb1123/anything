import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ToolConfig extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public adminID: number

  @column()
  public wpSite: string

  @column()
  public wpUsername: string

  @column()
  public wpPassword: string

  @column()
  public youtubeAPIKey: string

  @column()
  public source: string

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  static statusDelete: number = -1
}
