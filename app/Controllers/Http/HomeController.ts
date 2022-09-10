import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {
    public async index({view}: HttpContextContract) {
        const html = await view.render('home', {
            greeting: 'Hello'
        })
        return html
    }
}
