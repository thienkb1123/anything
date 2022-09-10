import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Yotube from 'App/Models/Youtube'
import Wordpress from 'App/Models/Wordpress'
import { getYoutubeVideoID, getYoutubeThumbnail, makeFileName, makeSlug } from 'App/Pkg/Common'


export default class MakeYtbContentsController {
    public async index({ view }: HttpContextContract) {
        return view.render('home', {
            greeting: 'Hello'
        })
    }

    public async makeContent({ request, view }: HttpContextContract) {
        const ytbVideoLink = request.input('ytb_video_link')
        const videoID = getYoutubeVideoID(ytbVideoLink)
        const ytbModel = new Yotube()
        const respVideo = await ytbModel.getVideo(videoID)
        const videoInfo = respVideo.items[0]
        const respCommentsThread = await ytbModel.getCommentsThread(videoID)
        const commentItems = respCommentsThread.items

        let first: number = 0
        let second: number = 0
        let commentsFirst: string[] = []
        let commentsSecond: string[] = []
        const maxCountGetComment = 2

        for (let i = 0; i < commentItems.length; i++) {
            const val = commentItems[i]
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

        const imageAddr = getYoutubeThumbnail(videoInfo.snippet.thumbnails, '')

        const content = await view.render('template.post', {
            title: videoInfo.snippet.title,
            desciption: videoInfo.snippet.description,
            tags: videoInfo.snippet.tags,
            embed: ytbVideoLink,
            commentsFirst: commentsFirst,
            commentsSecond: commentsSecond,
        })
        
        const wpModel = new Wordpress()
        const respCreateMedia = await wpModel.createMedia(imageAddr, makeFileName(videoInfo.snippet.title))
        const respCreatePost = await wpModel.createPost({
            title: videoInfo.snippet.title,
            slug: makeSlug(videoInfo.snippet.title),
            content: content,
            status: "draft",
            format: "aside",
            featured_media: respCreateMedia.id,
            categories: [1, 148],
            tags: [171, 169],
        })

        return view.render('home', {
            params: request.all()
        })
    }
}
