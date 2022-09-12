import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProfileController {
    public async index({ view }: HttpContextContract) {
        return view.render('backend.profile.index')
    }
}
