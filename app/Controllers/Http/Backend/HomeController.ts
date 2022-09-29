import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Menu from 'App/Models/Menu'

export default class HomeController {

    public async index({ view }: HttpContextContract) {

        const menuParent = await Menu.query()
            .select(
                'menu.id',
                'menu.name',
                'menu.slug',
            )
            .where('menu.status', Menu.statusPublish)

        for(const val in menuParent) {
            console.log(val)
        }



        return view.render('backend.home.index')
    }

}
