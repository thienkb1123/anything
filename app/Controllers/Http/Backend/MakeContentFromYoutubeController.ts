import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import ToolConfig from 'App/Models/ToolConfig'
import Youtube from 'App/Models/Youtube'
import WordPress from 'App/Models/WordPress'
import Alert from 'App/Pkg/Alert'
import Common from 'App/Pkg/Common'

export default class MakeContentFromYoutubeController {

  public async create({ view, auth }: HttpContextContract) {
    const listSites = await ToolConfig.query()
      .where('status', ToolConfig.statusEnable)
      .where('admin_id', auth.user?.id)
      .finally()

    return view.render('backend.makecontent.youtube.create', {
      listSites: listSites,
    })
  }

  public async store({ request, response, session, view }: HttpContextContract) {
    const newCreatePostSchema = schema.create({
      linkVideoYoutube: schema.string({ trim: true }),
      site: schema.string({ trim: true })
    })

    const data = await request.validate({ schema: newCreatePostSchema })
    const videoID = Common.getVideoIDYoutubeFromLink(data.linkVideoYoutube)
    console.log(videoID)
    if (!videoID) {
      return
    }

    try {
      const videos = await Youtube.getVideos(videoID)
      const videosItem = videos.items[0]
      const commentThreads = await Youtube.getCommentsThread(videoID)
      const commentThreadsItems = commentThreads.items

      let first: number = 0
      let second: number = 0
      let commentsFirst: string[] = []
      let commentsSecond: string[] = []
      const maxCountGetComment = 2

      for (let i in commentThreadsItems) {
        const val = commentThreadsItems[i]
        if (first < maxCountGetComment) {
          commentsFirst.push(val.snippet.topLevelComment.snippet.textOriginal)
          first++
          continue
        }

        if (second < maxCountGetComment) {
          commentsSecond.push(val.snippet.topLevelComment.snippet.textOriginal)
          second++
          continue
        }
        break
      }

      const imageAddr = Youtube.getThumbnail(videosItem.snippet.thumbnails, '')

      const content = await view.render('template.post', {
        title: videosItem.snippet.title,
        desciption: videosItem.snippet.description,
        tags: videosItem.snippet.tags,
        embed: data.linkVideoYoutube,
        commentsFirst: commentsFirst,
        commentsSecond: commentsSecond,
      })

      const respCreateMedia = await WordPress.createMedia(imageAddr, Common.makeFileName(videosItem.snippet.title))
      const respCreatePost = await WordPress.createPost({
        title: videosItem.snippet.title,
        slug: Common.makeSlug(videosItem.snippet.title),
        content: content,
        status: request.input('status'),
        format: "aside",
        featured_media: respCreateMedia.id,
        categories: request.input('categories') as number[],
        tags: request.input('tags') as number[],
      })

      session.flash('alert', {
        type: Alert.getSuccessType(),
        title: 'Successfully',
        message: "Create a post successfully.You can check data in manage your site"
      })

    } catch (error) {
      session.flash('alert', {
        type: Alert.getErrorType(),
        title: 'Failure',
        message: error
      })
    }

    return response.redirect().toRoute('backend.tools.makecontent.youtube.create')
  }

  public async infoCreatePost({ request, response }: HttpContextContract) {
    const siteAddr = request.input('siteAddr')
    const listCategories = await WordPress.listCategories(siteAddr)
    let categories: object[] = []
    for (let category of listCategories) {
      categories.push({
        id: category.id,
        text: category.name
      })
    }

    const listTags = await WordPress.listTags(siteAddr)
    let tags: object[] = []
    for (let tag of listTags) {
      tags.push({
        id: tag.id,
        text: tag.name
      })
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
