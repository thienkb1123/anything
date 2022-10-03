import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Menu from 'App/Models/Menu'
import Post from 'App/Models/Post'

export default class HomeController {
    public async index({ view }: HttpContextContract) {
        
        const postFeatured = await Post.query()
            .select(
                'post.id',
                'post.title',
                'post.slug',
                'post.summary',
                'post.created_at',
                'media.path as mediaPath',
            )
            .leftJoin('post_media', 'post_media.post_id', '=', 'post.id')
            .leftJoin('media', 'media.id', '=', 'post_media.media_id')
            .where('post.status', Post.statusPublish)
            .limit(4)

        return view.render('frontend.home.index', {
            postFeatured: postFeatured,
            title: 'Trang Chủ'
        })
    }

    public async detail({ view }: HttpContextContract) {
        return view.render('frontend.home.detail')
    }
}
