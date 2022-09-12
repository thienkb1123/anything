import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Yotube from 'App/Models/Youtube'

export default class HomeController {

    public async index({ view }: HttpContextContract) {
        const ytbModel = new Yotube()

        const resp = await ytbModel.getCommentsThread('DKbfBSrjVHA')

        console.log(resp)

        return view.render('backend.home.index')
    }

}
