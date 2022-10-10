import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {
    public async index({ view }: HttpContextContract) {
        return view.render('frontend.home.index', {
            title: 'Trang Chủ',

        })
    }

    public async detail({ view }: HttpContextContract) {
        return view.render('frontend.home.detail')
    }
}
