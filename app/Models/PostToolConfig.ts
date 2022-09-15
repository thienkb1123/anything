import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PostToolConfig extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public adminID: number

  @column()
  public site: string

  @column()
  public siteAPIKey: string

  @column()
  public sourceAPIKey: string

  @column()
  public source: string

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  static statusDisable: number = 0
  static statusEnable: number = 1
  static statusDelete: number = -1

  static get table() {
    return 'post_tool_config'
  }
}
