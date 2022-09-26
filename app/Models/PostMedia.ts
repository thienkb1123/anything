import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PostMedia extends BaseModel {
    public static table = 'post_media'

    @column({ isPrimary: true })
    public id: number

    @column()
    public postID: number

    @column()
    public mediaID: number
}
