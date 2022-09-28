import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class MenuCategory extends BaseModel {
    public static table = 'menu_category'

    @column({ isPrimary: true })
    public id: number

    @column()
    public menuID: number

    @column()
    public categoryID: number
}
