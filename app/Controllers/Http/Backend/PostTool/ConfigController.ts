import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import PostToolConfig from 'App/Models/PostToolConfig'
import Alert from 'App/Pkg/Alert'
import Common from 'App/Pkg/Common'

export default class ConfigController {
    private newPostToolConfig = schema.create({
        site: schema.string({ trim: true }, [
            rules.maxLength(100),
            rules.minLength(10)
        ]),
        siteAPIKey: schema.string({ trim: true }, [
            rules.maxLength(255),
            rules.minLength(10)
        ]),
        sourceAPIKey: schema.string({ trim: true }, [
            rules.maxLength(255),
            rules.minLength(10)
        ]),
    })

    public async index({ request, view }: HttpContextContract) {
        const limit = 10
        const page = request.input('page', 1)
        const listConfigs = await PostToolConfig.query()
            .where('status', '<>', PostToolConfig.statusDelete)
            .paginate(page, limit)

        return view.render('backend.post-tool.config.index', {
            listConfigs: listConfigs || []
        })
    }

    public async create({ view }: HttpContextContract) {
        return view.render('backend.post-tool.config.curd', {
            formActionURL: Route.makeUrl('backend.post-tool.config.store'),
            title: 'Create Post Tool Config',
        })
    }

    public async show({ request, response, view, auth }: HttpContextContract) {
        const id = request.param('id')
        if (!id) {
            return response.redirect().toRoute('backend.post-tool.config.index')
        }

        const config = await PostToolConfig.query()
            .where('id', id)
            .where('admin_id', auth.user?.id)
            .firstOrFail()

        return view.render('backend.post-tool.config.curd', {
            formActionURL: Route.makeUrl('backend.post-tool.config.update', { id: id }, { qs: { _method: 'PUT' } }),
            config: config,
            title: 'Update Post Tool Config',
        })
    }

    public async store({ request, response, auth, session }: HttpContextContract) {
        const data = await request.validate({ schema: this.newPostToolConfig })
        try {
            await PostToolConfig.create({
                author: auth.user?.id as number,
                site: data.site,
                siteAPIKey: data.siteAPIKey,
                sourceAPIKey: data.sourceAPIKey,
                source: 'youtube',
                status: request.input('status') as number,
            })
            session.flash('alert', Alert.create('Create successfully', Alert.success))
        } catch (error) {
            session.flash('alert', Alert.create("Create failure. Let's try", Alert.error))
        }

        return response.redirect().toRoute('backend.post-tool.config.index')
    }

    public async update({ request, response, auth, session }: HttpContextContract) {
        const id = request.param('id')
        if (!id) {
            return response.redirect().toRoute('backend.post-tool.config.index')
        }

        const data = await request.validate({ schema: this.newPostToolConfig })

        try {
            await PostToolConfig.query()
                .where('id', id)
                .where('admin_id', auth.user?.id)
                .update({
                    site: data.site,
                    siteAPIKey: data.siteAPIKey,
                    sourceAPIKey: data.sourceAPIKey,
                    source: request.input('source'),
                    status: request.input('status') as number,
                })

            session.flash('alert', Alert.create('Update successfully', Alert.success))
        } catch (error) {
            session.flash('alert', Alert.create("Update failure. Let's trye", Alert.error))
        }

        return response.redirect().toRoute('backend.post-tool.config.index')
    }

    public async destroy({ request, response, auth }: HttpContextContract) {
        const id = request.param('id')
        if (!id) {
            return response.redirect().toRoute('backend.post-tool.config.index')
        }

        try {
            const res = await PostToolConfig.query()
                .where('id', id)
                .where('admin_id', auth.user?.id)
                .update({
                    status: PostToolConfig.statusDelete,
                    updated_at: Common.currentDateTime()
                })
        } catch (error) {
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
