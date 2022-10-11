import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Post from 'App/Models/Post'

export default class CategoriesController {
    async index  ({ request, view }: HttpContextContract){
        const limit = 10
        const page = request.input('page', 1)
        const postList = await Post.query()
        .select(
            'post.id',
            'post.title',
            'post.slug',
            'post.summary',
            'post.created_at',
            'media.path as mediaPath',
            Database.raw(`
            (
                select
                    tag.name
                from
                    tag
                left join post_tag ON post_tag.post_id = post.id
                where
                    post_tag.post_id = post.id
                    and tag.status = 1
                limit
                    1
            ) AS tagsName
        `),
        )
        .leftJoin('post_media', 'post_media.post_id', '=', 'post.id')
        .leftJoin('media', 'media.id', '=', 'post_media.media_id')
        .where('post.status', Post.statusPublish)
        .paginate(page, limit)

        return view.render('frontend.category.index', {
            postList: postList,
            title: 'Danh mục'
        })
    }
}
