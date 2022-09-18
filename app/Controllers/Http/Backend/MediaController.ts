import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'

export default class MediaController {

    public async index({ request, view }: HttpContextContract) {

        return view.render('backend.post.index', {
            posts: []
        })
    }

    public async create({ request, view }: HttpContextContract) {

        return view.render('backend.post.curd', {
            title: 'Create a post',
        })
    }

    aaaa() {

    }

    public async store({ request, response }: HttpContextContract) {
        const images = request.files('files')

        for (let image of images) {
            await image.move(Application.publicPath('post'),{
                overwrite: false, // overwrite in case of conflict
            })
        }
        
        return response.json(images)
    }

    public async show({ request, view }: HttpContextContract) {

        return view.render('backend.post.curd')
    }

    public async edit({ request }: HttpContextContract) {

    }

    public async update({ request }: HttpContextContract) {

    }

    public async destroy({ request }: HttpContextContract) {

    }
}

