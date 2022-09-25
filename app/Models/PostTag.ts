import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PostTag extends BaseModel {
    public static table = 'post_tag'

    @column({ isPrimary: true })
    public id: number

    @column()
    public postID: number

    @column()
    public tagID: number
}
