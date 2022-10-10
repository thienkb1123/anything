import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import Database from '@ioc:Adonis/Lucid/Database'

export default class Post extends BaseModel {
    public static table = 'post'

    @column({ isPrimary: true })
    public id: number

    @column()
    public author: number

    @column()
    public title: string

    @column()
    @slugify({
        strategy: 'dbIncrement',
        fields: ['title'],
        allowUpdates: false,
    })
    public slug: string

    @column()
    public summary: string

    @column()
    public content: string

    @column()
    public status: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    public static statusDelete = -1
    public static statusPublish = 1
}
