import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import { schema } from '@ioc:Adonis/Core/Validator'
import PostToolConfig from 'App/Models/PostToolConfig'
import Youtube from 'App/Models/Youtube'
import WordPress, { Category, Tag } from 'App/Models/WordPress'
import Alert, { Option } from 'App/Pkg/Alert'
import Common from 'App/Pkg/Common'

export default class WordPressController {

  public async create({ request, view, auth }: HttpContextContract) {
    const listConfigs = await PostToolConfig.query()
      .where('status', PostToolConfig.statusEnable)
      .where('admin_id', auth.user?.id)
      .finally()

    let alert: Option | null = null
    if (listConfigs.length === 0) {
      alert = new Option(
        'You have not set up config yet. Click button OK for adding new config',
        Alert.warn,
        Route.makeUrl('backend.post-tool.config.index')
      )
    }

    let listCategories: object[] = []
    let listTags: object[] = []
    const siteAddr = request.input('site')
    if (siteAddr) {
      listCategories = await WordPress.listCategories(siteAddr)
      listTags = await WordPress.listTags(siteAddr)
    }

    return view.render('backend.post-tool.wordpress.create-post', {
      listConfigs: listConfigs,
      alert: alert,
      params: request.qs(),
      categories: listCategories,
      tags: listTags
    })
  }

  public async store({ request, response, session, view }: HttpContextContract) {
    const newCreatePostSchema = schema.create({
      linkVideoYoutube: schema.string({ trim: true }),
      site: schema.string({ trim: true })
    })

    try {
      await request.validate({ schema: newCreatePostSchema, data: request.all() })
    } catch (error) {
      session.flash('errors', error.messages)
      return response.redirect().withQs(request.all()).toRoute('backend.post-tool.wordpress.create')
    }

    const linkVideoYoutube = request.input('linkVideoYoutube')
    const videoID = Common.getVideoIDYoutubeFromLink(linkVideoYoutube)
    if (!videoID) {
      session.flash('alert', Alert.create("The link video is invalid", Alert.error))
      return response.redirect().withQs(request.all()).toRoute('backend.post-tool.wordpress.create')
    }

    try {
      const site = request.input('site')
      const config = await PostToolConfig.findBy('site', site)
      if (!config?.site || !config?.siteAPIKey || !config?.sourceAPIKey) {
        session.flash('alert', Alert.create("Config is invalid", Alert.error))
        return response.redirect().withQs(request.all()).toRoute('backend.post-tool.wordpress.create')
      }

      const videos = await Youtube.getVideos(config.sourceAPIKey, videoID)
      const videosItem = videos.items[0]
      const commentThreads = await Youtube.getCommentsThread(config.sourceAPIKey, videoID)
      const commentThreadsItems = commentThreads.items

      let commentsFirst: string[] = []
      const maxCountGetComment = 2
      const firtStartGetComment = 0
      commentThreadsItems.slice(firtStartGetComment, maxCountGetComment).map(val => {
        commentsFirst.push(val.snippet.topLevelComment.snippet.textOriginal)
      })

      let commentsSecond: string[] = []
      const secondStartGetComment = firtStartGetComment * maxCountGetComment
      commentThreadsItems.slice(secondStartGetComment, secondStartGetComment + maxCountGetComment).map(val => {
        commentsSecond.push(val.snippet.topLevelComment.snippet.textOriginal)
      })

      const imageAddr = Youtube.getThumbnail(videosItem.snippet.thumbnails, '')
      const content = await view.render('template.post', {
        title: videosItem.snippet.title,
        desciption: videosItem.snippet.description,
        tags: videosItem.snippet.tags,
        embed: linkVideoYoutube,
        commentsFirst: commentsFirst,
        commentsSecond: commentsSecond,
      })

      const respCreateMedia = await WordPress.createMedia(
        config.siteAPIKey,
        imageAddr,
        Common.makeFileName(videosItem.snippet.title)
      )
      await WordPress.createPost(config.siteAPIKey, {
        title: videosItem.snippet.title,
        slug: Common.makeSlug(videosItem.snippet.title),
        content: content,
        status: request.input('status'),
        format: "aside",
        featured_media: respCreateMedia.id,
        categories: request.input('categories') as number[],
        tags: request.input('tags') as number[],
      })

      session.flash('alert', Alert.create('Create a post successfully.You can check data in manage your site', Alert.success))
    } catch (error) {
      session.flash('alert', Alert.create("Create failure. Let is trye", Alert.error))
      return response.redirect().withQs(request.all()).toRoute('backend.post-tool.wordpress.create')
    }

    return response.redirect().toRoute('backend.post-tool.wordpress.create')
  }

  public async infoCreatePost({ request, response }: HttpContextContract) {
    const siteAddr = request.input('siteAddr')
    if (!siteAddr) {
      return response.json({ code: 400, message: 'param invalid' })
    }

    let listCategories: Category[] = []
    let listTags: Tag[] = []
    try {
      listCategories = await WordPress.listCategories(siteAddr)
      listTags = await WordPress.listTags(siteAddr)
    } catch (error) {
      return response.json({ code: 400, message: error })
    }

    let categories: object[] = []
    for (let category of listCategories) {
      categories.push({ id: category.id, text: category.name })
    }

    let tags: object[] = []
    for (let tag of listTags) {
      tags.push({ id: tag.id, text: tag.name })
    }

    return response.json({
      code: 0,
      message: 'Success',
      result: {
        categories: categories,
        tags: tags
      }
    })
  }
}
