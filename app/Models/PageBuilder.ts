import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PageBuilder extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public author: number

    @column()
    public title: string

    @column()
    public uri: string

    @column({
        serialize: (value: string | null) => {
            return value ? JSON.parse(value) : value
        }
    })
    public layouts: JSON

    @column()
    public status: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    public static statusDelete = -1
    public static statusPublish = 1
}
