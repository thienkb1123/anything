import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import CategoryValidator from 'App/Validators/CategoryValidator'
import Category from 'App/Models/Category'
import Alert from 'App/Pkg/Alert'
import Common from 'App/Pkg/Common'
import Client from 'App/Pkg/Client'

export default class CategoryController {
  public async index({ request, auth, view }: HttpContextContract) {
    const limit = 10
    const page = request.input('page', 1)
    const categories = await Category.query()
      .where('status', '<>', Category.statusDelete)
      .where('author', auth.user?.id)
      .paginate(page, limit)

    return view.render('backend.category.index', {
      title: 'List categories',
      categories: categories
    })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('backend.tag.curd', {
      title: 'Create a new category',
      formActionURL: Route.makeUrl('backend.category.store'),
    })
  }

  public async store({ request, response, session, auth }: HttpContextContract) {
    const payload = await request.validate(CategoryValidator)
    try {
      await Category.create({
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
    return response.redirect().toRoute('backend.category.index')
  }

  public async edit({ request, response, auth, view }: HttpContextContract) {
    const id = request.param('id')
    if (!id) {
      return response.redirect().toRoute('backend.category.index')
    }

    const tag = await Category.query()
      .where('id', id)
      .where('author', auth.user?.id)
      .firstOrFail()

    return view.render('backend.tag.curd', {
      formActionURL: Route.makeUrl('backend.category.update', { id: id }, { qs: { _method: 'PUT' } }),
      tag: tag,
      title: 'Update tag',
    })
  }

  public async update({ request, response, auth, session }: HttpContextContract) {
    const id = request.param('id')
    if (!id) {
      return response.redirect().toRoute('backend.tag.index')
    }

    const payload = await request.validate(CategoryValidator)
    try {
      await Category.query()
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
    return response.redirect().toRoute('backend.category.index')
  }

  public async destroy({ request, response, auth }: HttpContextContract) {
    const id = request.param('id')
    if (!id) {
      return response.redirect().toRoute('backend.category.index')
    }

    try {
      await Category.query()
        .where('id', id)
        .where('author', auth.user?.id)
        .update({
          status: Category.statusDelete,
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
      return response.redirect().toRoute('backend.category.index')
    }
    try {
      await Category.query()
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
