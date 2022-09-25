import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PostCategory extends BaseModel {
    public static table = 'post_category'

    @column({ isPrimary: true })
    public id: number

    @column()
    public postID: number

    @column()
    public categoryID: number
}
