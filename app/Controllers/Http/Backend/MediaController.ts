import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Media from 'App/Models/Media'
import Common from 'App/Pkg/Common'
import Client from 'App/Pkg/Client'

export default class MediaController {

    async index({ request, view }: HttpContextContract) {
        return view.render('backend.post.index', {
            posts: []
        })
    }

    async create({ request, view }: HttpContextContract) {
        return view.render('backend.post.curd', {
            title: 'Create a post',
        })
    }

    async store({ request, response }: HttpContextContract) {
        const file = request.file('file', {
            size: '5mb',
            extnames: ['jpg', 'jpg', 'gif', 'png'],
        })

        if (!file) {
            return response.json({
                "success": 0,
                "message": "file input wrong"
            })
        }

        if (!file.isValid) {
            return response.json({
                "success": 0,
                "message": file.errors
            })
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
        media.save()

        return response.json({
            "success": 1,
            "file": {
                "url": media.path,
            }
        })
    }

    async show({ request, view }: HttpContextContract) {

        return view.render('backend.post.curd')
    }

    async list({ request, response }: HttpContextContract) {
        const list = await Media.query()
            .select('id', 'name', 'path', 'size', 'created_at')
            .orderBy('created_at', 'desc')
            .limit(20)

        console.log(list)

        return response.json(Client.NewRespJSON(
            Client.codeOk,
            Client.messageOk,
            { items: list || [] },
        ))
    }

    async destroy({ request }: HttpContextContract) {

    }
}

