import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PageBuilder from 'App/Models/PageBuilder'

export default class PageBuildersController {

    async index({ request, auth, view }: HttpContextContract) {

        return view.render('backend.pageBuilder.index', {
            pageBuilderList: [],
            title: 'Page builder list'
        })
    }

    async create({ request, auth, view }: HttpContextContract) {
        return view.render('backend.pageBuilder.curd', {
            title: 'Create page builder'
        })
    }

    async edit() {

    }

    async store() {

    }

    async update() {

    }

    async destroy() {

    }
}
