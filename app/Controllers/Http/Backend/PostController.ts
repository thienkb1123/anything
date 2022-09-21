import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import Post from 'App/Models/Post'
import PostValidator from 'App/Validators/PostValidator'
import Alert from 'App/Pkg/Alert'
// import Common from 'App/Pkg/Common'

export default class PostController {
  public async index({ request, view }: HttpContextContract) {

    return view.render('backend.post.index', {
      posts: []
    })
  }

  public async create({ request, view }: HttpContextContract) {
    return view.render('backend.post.curd', {
      title: 'Create a post',
      formActionURL: Route.makeUrl('backend.post.store'),
    })
  }

  public async store({ request, response, session, auth }: HttpContextContract) {
    const payload = await request.validate(PostValidator)
    try {
      await Post.create({
        author: auth.user?.id as number,
        title: payload.title,
        slug: payload.slug,
        summary: payload.summary,
        content: payload.content,
        status: request.input('status') as number,
      })
      session.flash('alert', Alert.create('Create successfully', Alert.success))
    } catch (error) {
      session.flash('alert', Alert.create("Create failure. Let's try", Alert.error))
    }
    return response.redirect().toRoute('backend.tag.index')
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
