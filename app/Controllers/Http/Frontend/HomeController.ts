import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import PageBuilder from 'App/Models/PageBuilder'

export default class HomeController {
    public async index({ view }: HttpContextContract) {
        const page = await PageBuilder
            .query()
            .where('status', PageBuilder.statusPublish)
            .where('uri', '/').first()

        const postsFeatured = await Post.getFeatured()

        return view.render('frontend.home.index', {
            postsFeatured: postsFeatured,
            title: 'Trang Chủ',
            page: page?.serialize()

        })
    }

    public async detail({ view }: HttpContextContract) {
        return view.render('frontend.home.detail')
    }
}
