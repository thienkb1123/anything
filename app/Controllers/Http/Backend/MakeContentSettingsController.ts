import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MakeContentSettingsController {
    public async index({ view }: HttpContextContract) {
        return view.render('backend.makecontent.setting.index')
    }
}
