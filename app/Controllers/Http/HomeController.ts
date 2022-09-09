import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import View from '@ioc:Adonis/Core/View'


export default class HomeController {
    public async index(ctx: HttpContextContract) {


        const html = await View.render('home', {
            greeting: 'Hello'
        })
        return html
    }
}
