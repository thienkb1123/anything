import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MakeContentFromYoutubeController {

    public async index({ view }: HttpContextContract) {
        return view.render('backend.makecontent.youtube.index')
    }
}
