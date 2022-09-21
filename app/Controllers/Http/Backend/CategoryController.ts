import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoryController {
    public async index({ request, view }: HttpContextContract) {

    }

    public async create({ request, view }: HttpContextContract) {

    }

    public async store({ request, response }: HttpContextContract) {

    }

    public async show({ request, view }: HttpContextContract) {

        return view.render('backend.post.curd')
    }

    public async destroy({ request }: HttpContextContract) {

    }
}
