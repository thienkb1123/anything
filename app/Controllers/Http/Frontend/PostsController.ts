import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'

export default class PostsController {
    async show({ request, view }: HttpContextContract) {
        const slug = request.param('slug')
        const post = await Post.query()
            .select(
                'post.id',
                'post.title',
                'post.content',
                'post.created_at',
                'media.path as mediaPath',
            )
            .leftJoin('post_media', 'post_media.post_id', '=', 'post.id')
            .leftJoin('media', 'media.id', '=', 'post_media.media_id')
            .where('post.slug', slug)
            .where('post.status', Post.statusPublish)
            .first()

        return view.render('frontend.post.detail', {
            post: post,
            title: post?.title,
        })
    }

    async list({ response, view }: HttpContextContract) {
        const posts = await Post.getFeatured()
        let entrys = []
        for (const post of posts) {
            console.log(post)
            entrys.push({
                "id": post.id,
                "published": {
                    "$t": "2021-08-02T06:33:00.013-07:00"
                },
                "category": [
                    {
                        "scheme": "http://www.blogger.com/atom/ns#",
                        "term": "Apple"
                    },
                    {
                        "scheme": "http://www.blogger.com/atom/ns#",
                        "term": "Laptops"
                    }
                ],
                "title": {
                    "type": "text",
                    "$t": "11 of Best Laptops Evaluated Based on Budget"
                },
                "link": [
                    {
                        "rel": "alternate",
                        "type": "text/html",
                        "href": "https:\/\/magspot-template.blogspot.com\/2021\/08\/11-of-best-laptops-evaluated-based-on.html",
                        "title": "11 of Best Laptops Evaluated Based on Budget"
                    }
                ],
                "media$thumbnail": {
                    "url": "https:\/\/1.bp.blogspot.com\/-uK5sQ5rOkRU\/YQf0I-jK87I\/AAAAAAAAAW0\/INcqkESmgFYXh__ci2SPmMUHziYhGchtwCLcBGAsYHQ\/s72-c\/pbt66.jpg",
                    "height": "72",
                    "width": "72"
                }
            } )
        }

        return response.json({
            version: "1.0.0",
            encoding: "UTF-8",
            feed: {
                entry: entrys
            }
        })
    }
}
