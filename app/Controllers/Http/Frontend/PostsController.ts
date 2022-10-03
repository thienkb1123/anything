import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostsController {
    async show({ view }: HttpContextContract) {

        return view.render('frontend.post.detail')
    }
}
