import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'

export default class PostsController {
    async show({ request, view }: HttpContextContract) {
        const slug = request.param('slug')
        const post = await Post.query()
            .select(
                'post.id',
                'post.title',
                'post.content',
                'post.created_at',
                'media.path as mediaPath',
            )
            .leftJoin('post_media', 'post_media.post_id', '=', 'post.id')
            .leftJoin('media', 'media.id', '=', 'post_media.media_id')
            .where('post.slug', slug)
            .where('post.status', Post.statusPublish)
            .first()

        return view.render('frontend.post.detail', {
            post: post,
            title: post?.title,
        })
    }
}
