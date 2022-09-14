import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'
import ToolConfig from 'App/Models/ToolConfig'
import Alert from 'App/Pkg/Alert'

export default class MakeContentToolConfigController {

    private newToolConfigSchema = schema.create({
        wpSite: schema.string({ trim: true }, [
            rules.maxLength(100),
            rules.minLength(10)
        ]),
        wpUsername: schema.string({ trim: true }, [
            rules.maxLength(50),
            rules.minLength(3)
        ]),
        wpPassword: schema.string({ trim: true }, [
            rules.maxLength(100),
            rules.minLength(6)
        ]),
        youtubeAPIKey: schema.string({ trim: true }, [
            rules.maxLength(100),
            rules.minLength(5)
        ]),
    })

    public async index({ request, view }: HttpContextContract) {
        const limit = 10
        const page = request.input('page', 1)
        const toolConfigs = await ToolConfig.query()
            .where('status', '<>', ToolConfig.statusDelete)
            .paginate(page, limit)

        return view.render('backend.makecontent.config.index', {
            toolConfigs: toolConfigs || []
        })
    }

    public async create({ view }: HttpContextContract) {
        return view.render('backend.makecontent.config.crud', {
            formActionURL: Route.makeUrl('backend.tools.makecontent.config.create'),
            title: 'Create Config For Making Content Tool',
        })
    }

    public async show({ request, response, view, auth }: HttpContextContract) {
        const id = request.param('id')
        if (!id) {
            return response.redirect().toRoute('backend.tools.makecontent.config.index')
        }

        const toolConfig = await ToolConfig.query()
            .where('id', id)
            .where('admin_id', auth.user?.id)
            .firstOrFail()

        return view.render('backend.makecontent.config.crud', {
            formActionURL: Route.makeUrl('backend.tools.makecontent.config.update', { id: id }, { qs: { _method: 'PUT' } }),
            toolConfig: toolConfig,
            title: 'Update Config For Making Content Tool',
        })
    }

    public async store({ request, response, auth, session }: HttpContextContract) {
        const data = await request.validate({ schema: this.newToolConfigSchema })
        try {
            await ToolConfig.create({
                adminID: auth.user?.id as number,
                wpSite: data.wpSite,
                wpUsername: data.wpUsername,
                wpPassword: data.wpPassword,
                youtubeAPIKey: data.youtubeAPIKey,
                source: 'youtube',
                status: request.input('status') as number,
            })

            session.flash('alert', {
                type: Alert.getSuccessType(),
                title: 'Successfully',
                message: 'Create config for making successfully content '
            })

        } catch (error) {
            session.flash('alert', {
                type: Alert.getErrorType(),
                title: 'Faillure',
                message: "Create config for making failure content tool. Let's try"
            })
        }

        return response.redirect().toRoute('backend.tools.makecontent.config.index')
    }

    public async update({ request, response, auth, session }: HttpContextContract) {
        const id = request.param('id')
        if (!id) {
            return response.redirect().toRoute('backend.tools.makecontent.config.index')
        }

        const data = await request.validate({ schema: this.newToolConfigSchema })

        try {
            await ToolConfig.query()
                .where('id', id)
                .where('admin_id', auth.user?.id)
                .update({
                    wpSite: data.wpSite,
                    wpUsername: data.wpUsername,
                    wpPassword: data.wpPassword,
                    youtubeAPIKey: data.youtubeAPIKey,
                    status: request.input('status') as number,
                })

            session.flash('alert', {
                type: Alert.getSuccessType(),
                title: 'Successfully',
                message: 'Update config for making successfully content '
            })

        } catch (error) {
            session.flash('alert', {
                type: Alert.getErrorType(),
                title: 'Faillure',
                message: "Update config for making failure content tool. Let's try"
            })
        }

        return response.redirect().toRoute('backend.tools.makecontent.config.index')
    }

    public async destroy({ request, response, auth }: HttpContextContract) {
        const id = request.param('id')
        if (!id) {
            return response.redirect().toRoute('backend.tools.makecontent.config.index')
        }

        try {
            const res = await ToolConfig.query()
                .where('id', id)
                .where('admin_id', auth.user?.id)
                .update({
                    status: ToolConfig.statusDelete,
                    updated_at: DateTime.now().toFormat('yyyy-mm-dd HH:mm:ss')
                })

            console.log(res, auth.user?.id)
        } catch (error) {
            console.log(error)
            return response.json({
                code: 400,
                message: 'Failure'
            })
        }

        return response.json({
            code: 0,
            message: 'Success',
            result: {
                id: id,
            }
        })
    }
}