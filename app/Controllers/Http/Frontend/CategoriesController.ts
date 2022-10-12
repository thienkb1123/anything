import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Post from 'App/Models/Post'
import Menu from 'App/Models/Menu'

export default class CategoriesController {
    async index({ request, view }: HttpContextContract) {
        const slug = request.param('slug', '')

        const menu = await Menu.query()
            .select(
                'menu.name',
                Database.raw('group_concat(menu_category.category_id) as categoriesID')
            )
            .leftJoin('menu_category', 'menu_category.menu_id', 'menu.id')
            .where('status', Menu.statusPublish)
            .where('slug', slug)
            .firstOrFail()

        let categoriesID: number[] = []
        if (menu) {
            categoriesID = menu.$extras.categoriesID?.split(',')
        }

        let postList: Post[] = []
        if (categoriesID){
            const limit = 10
            const page = request.input('page', 1)
            postList = await Post.query()
            .select(
                'post.id',
                'post.title',
                'post.slug',
                'post.summary',
                'post.created_at',
                'media.path as mediaPath',
                Database.raw(`group_concat(tag.name) as tagsName`)
            )
            .leftJoin('post_media', 'post_media.post_id', '=', 'post.id')
            .leftJoin('media', 'media.id', '=', 'post_media.media_id')
            .leftJoin('post_tag', 'post_tag.post_id', '=', 'post.id')
            .leftJoin('tag', 'tag.id', '=', 'post_tag.tag_id')
            .leftJoin('post_category', 'post_category.post_id', '=', 'post.id')
            .where('post.status', Post.statusPublish)
            .whereIn('post_category.category_id', categoriesID)
            .groupBy('post.id')
            .paginate(page, limit)
        }

        return view.render('frontend.category.index', {
            postList: postList,
            menu: menu,
            title: menu.name,
        })
    }
}
