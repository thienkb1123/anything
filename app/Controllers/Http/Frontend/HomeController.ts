import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Menu from 'App/Models/Menu'
import Post from 'App/Models/Post'

export default class HomeController {
    public async index({ view }: HttpContextContract) {
        const menu = await Menu.query()
            .select(
                'menu.id',
                'menu.parent_id',
                'menu.name',
                'menu.slug',
            )
            .where('menu.status', Menu.statusPublish)

        let menuList: Menu[] = []
        for (let parent of menu) {
            if (parent.parentID !== Menu.isParent) {
                continue
            }

            let menuChilden: Menu[] = []
            for (const childen of menu) {
                if (parent.id === childen.parentID) {
                    menuChilden.push(childen)
                }
            }

            parent.subMenu = menuChilden
            menuList.push(parent)
        }

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
            menuList: menuList,
            postFeatured: postFeatured,
            title: 'Trang Chủ'
        })
    }

    public async detail({ view }: HttpContextContract) {
        return view.render('frontend.home.detail')
    }
}
