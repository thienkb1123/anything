import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Media from 'App/Models/Media'
import Common from 'App/Pkg/Common'

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

    public async store({ request, response }: HttpContextContract) {
        const files = request.files('files', {
            size: '5mb',
            extnames: ['jpg', 'jpg', 'gif', 'png'],
        })

        let mediaList: Media[] = [];
        for (let file of files) {
            if (!file.isValid) {
                continue
            }

            const fileName = Common.createFileName(file.clientName)
            const path = Common.pathMovePerMonth('media')
            await file.move(
                Application.publicPath(path),
                {
                    overwrite: false,
                    name: fileName,
                }
            )

            const media = new Media()
            media.name = fileName
            media.path = `/${path}/${fileName}`
            media.typeOfFile = file.extname as string
            media.type = file.type as string
            media.size = file.size
            mediaList.push(media)
        }

        await Media.createMany(mediaList)
        return response.json(files)
    }

    public async show({ request, view }: HttpContextContract) {

        return view.render('backend.post.curd')
    }

    public async list({ request, response }: HttpContextContract) {
        const list = await Media.query().orderBy('created_at', 'desc').limit(20)
        return response.json({
            code: 0,
            message: '',
            result: list
        })
    }

    public async destroy({ request }: HttpContextContract) {

    }
}

