import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import View from '@ioc:Adonis/Core/View'
import Menu from 'App/Models/Menu'

export default class GlobalsController {
    public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
        const menu = await Menu.query()
            .select(
                'menu.id',
                'menu.parent_id',
                'menu.name',
                'menu.slug',
            )
            .where('menu.status', Menu.statusPublish)
            .orderBy('menu.odr', 'asc')
            
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

        View.global('menuList', menuList)
        await next()
    }
}
