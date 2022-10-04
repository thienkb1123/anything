import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import PageBuilder from 'App/Models/PageBuilder'
import PageBuilderValidator from 'App/Validators/PageBuilderValidator'
import Alert from 'App/Pkg/Alert'

export default class PageBuildersController {

    async index({ request, auth, view }: HttpContextContract) {

        return view.render('backend.pageBuilder.index', {
            pageBuilderList: [],
            title: 'Page builder list'
        })
    }

    async create({ request, auth, view }: HttpContextContract) {
        return view.render('backend.pageBuilder.curd', {
            title: 'Create page builder',
            formActionURL: Route.makeUrl('backend.page_builder.store'),
        })
    }

    async edit() {

    }

    async store({ request, response, auth, session }: HttpContextContract) {
        const payload = await request.validate(PageBuilderValidator)
        try {
            await PageBuilder.create({
                author: auth.user?.id as number,
                title: payload.title,
                uri: payload.uri,
                layouts: request.input('layouts'),
                status: request.input('status') as number,
            })
            session.flash('alert', Alert.create('Create successfully', Alert.success))
        } catch (error) {
            console.log(error)
            session.flash('alert', Alert.create("Create failure. Let is try", Alert.error))
        }
        return response.redirect().toRoute('backend.page_builder.index')
    }

    async update() {

    }

    async destroy() {

    }
}
