import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

export default class Menu extends BaseModel {
    public static table = 'menu'

    @column({ isPrimary: true })
    public id: number

    @column()
    public parentID: number

    @column()
    public author: number

    @column()
    public name: string

    @column()
    @slugify({
        strategy: 'dbIncrement',
        fields: ['name'],
        allowUpdates: false,
    })
    public slug: string

    @column()
    public odr: number

    @column()
    public status: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    public static statusDelete = -1
    public static statusPublish = 1
    public static isParent = 0 

    public subMenu: Menu[]
}