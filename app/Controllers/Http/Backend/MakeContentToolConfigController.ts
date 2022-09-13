import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import ToolConfig from 'App/Models/ToolConfig'


export default class MakeContentToolConfigController {
    public async index({ request, view }: HttpContextContract) {
        const limit = 10
        const page = request.input('page', 1)
        const toolConfigs = await ToolConfig.query().paginate(page, limit)

        return view.render('backend.makecontent.config.index', {
            toolConfigs: toolConfigs || []
        })
    }

    public async create({ request, view }: HttpContextContract) {
        return view.render('backend.makecontent.config.crud')
    }

    public async show({ request, view }: HttpContextContract) {
        return view.render('backend.makecontent.config.crud')
    }

    public async updateOrCreate({ request, response, auth, view }: HttpContextContract) {
        const id = request.param('id')
        if (request.method() === 'POST') {
            const newSettingSchema = schema.create({
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
            const data = await request.validate({ schema: newSettingSchema })

            const searchPayload = {
                id: id
            }

            const updatePayload = {
                adminID: auth.user?.id as number,
                wpSite: data.wpSite,
                wpUsername: data.wpUsername,
                wpPassword: data.wpPassword,
                youtubeAPIKey: data.youtubeAPIKey,
                source: 'youtube',
                status: request.input('status') as number,
            }
            await ToolConfig.updateOrCreate(searchPayload, updatePayload)
            return response.redirect().toRoute('backend.makecontent.config.index')
        }

        let toolConfig = {}
        if (id) {
            toolConfig = await ToolConfig.query()
                .where('id', id)
                .where('admin_id', auth.user?.id)
                .firstOrFail()
        }

        return view.render('backend.makecontent.config.crud', {
            toolConfig: toolConfig
        })
    }
}
