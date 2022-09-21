import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import TagValidator from 'App/Validators/TagValidator'
import Tag from 'App/Models/Tag'
import Alert from 'App/Pkg/Alert'
import Common from 'App/Pkg/Common'
import Client from 'App/Pkg/Client'

export default class TagController {
  public async index({ request, auth, view }: HttpContextContract) {
    const limit = 10
    const page = request.input('page', 1)
    const tags = await Tag.query()
      .where('status', '<>', Tag.statusDelete)
      .where('author', auth.user?.id)
      .paginate(page, limit)

    return view.render('backend.tag.index', {
      title: 'Tag',
      tags: tags
    })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('backend.tag.curd', {
      title: 'Tag',
      formActionURL: Route.makeUrl('backend.tag.store'),
    })
  }

  public async store({ request, response, session, auth }: HttpContextContract) {
    const payload = await request.validate(TagValidator)
    try {
      await Tag.create({
        author: auth.user?.id as number,
        title: payload.title,
        slug: request.input('slug', ''),
        content: request.input('content', ''),
        status: request.input('status') as number,
      })
      session.flash('alert', Alert.create('Create successfully', Alert.success))
    } catch (error) {
      console.log(error)
      session.flash('alert', Alert.create("Create failure. Let is try", Alert.error))
    }
    return response.redirect().toRoute('backend.tag.index')
  }

  public async edit({ request, response, auth, view }: HttpContextContract) {
    const id = request.param('id')
    if (!id) {
      return response.redirect().toRoute('backend.tag.index')
    }

    const tag = await Tag.query()
      .where('id', id)
      .where('author', auth.user?.id)
      .firstOrFail()

    return view.render('backend.tag.curd', {
      formActionURL: Route.makeUrl('backend.tag.update', { id: id }, { qs: { _method: 'PUT' } }),
      tag: tag,
      title: 'Update tag',
    })
  }

  public async update({ request, response, auth, session }: HttpContextContract) {
    const id = request.param('id')
    if (!id) {
      return response.redirect().toRoute('backend.tag.index')
    }

    const payload = await request.validate(TagValidator)
    try {
      await Tag.query()
        .where('id', id)
        .where('author', auth.user?.id)
        .update({
          title: payload.title,
          slug: request.input('slug', ''),
          content: request.input('content', ''),
          status: request.input('status') as number,
        })

      session.flash('alert', Alert.create('Update successfully', Alert.success))
    } catch (error) {
      session.flash('alert', Alert.create("Update failure. Let is trye", Alert.error))
    }
    return response.redirect().toRoute('backend.tag.index')
  }

  public async destroy({ request, response, auth }: HttpContextContract) {
    const id = request.param('id')
    if (!id) {
      return response.redirect().toRoute('backend.tag.index')
    }

    try {
      await Tag.query()
        .where('id', id)
        .where('author', auth.user?.id)
        .update({
          status: Tag.statusDelete,
          updated_at: Common.currentDateTime()
        })
    } catch (error) {
      return response.json(Client.NewRespJSON(Client.codeError, Client.messageError))
    }
    return response.json(Client.NewRespJSON(Client.codeOk, Client.messageOk, { id: id }))
  }

  public async statusUpdate({ request, response, auth }: HttpContextContract) {
    const id = request.param('id')
    if (!id) {
      return response.redirect().toRoute('backend.tag.index')
    }
    try {
      await Tag.query()
        .where('id', id)
        .where('author', auth.user?.id)
        .update({
          status: request.input('status'),
          updated_at: Common.currentDateTime()
        })
    } catch (error) {
      return response.json(Client.NewRespJSON(Client.codeError, Client.messageError))
    }
    return response.json(Client.NewRespJSON(Client.codeOk, Client.messageOk, { id: id }))
  }
}
