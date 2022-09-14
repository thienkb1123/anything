import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MakeContentFromYoutubeController {

    public async create({ view }: HttpContextContract) {
        return view.render('backend.makecontent.youtube.create')
    }
}
