import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoriesController {
    async index  ({ request, view }: HttpContextContract){
        return view.render('frontend.category.index')
    }
}
