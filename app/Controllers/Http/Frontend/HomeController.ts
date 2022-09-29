import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Menu from 'App/Models/Menu'

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

        return view.render('frontend.home.index', {
            menuList: menuList
        })
    }

    public async detail({ view }: HttpContextContract) {
        return view.render('frontend.home.detail')
    }
}
