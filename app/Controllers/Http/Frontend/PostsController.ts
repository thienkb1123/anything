import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Route from '@ioc:Adonis/Core/Route'
import Post from 'App/Models/Post'

export default class PostsController {
    async show({ request, view }: HttpContextContract) {
        let slug = request.param('slug') as string
        slug = slug.replace('.html', '')
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
            .firstOrFail()

        return view.render('frontend.post.detail', {
            post: post,
            title: post?.title,
        })
    }

    async feeds({ request, response }: HttpContextContract) {
        const name = request.input('name', '')
        const limit = request.input('limit', 4) as number
        const posts = await Post.query()
            .select(
                'post.id',
                'post.title',
                'post.slug',
                'post.summary',
                'post.created_at',
                'media.path as mediaPath',
                Database.raw(`
                (
                    select
                        tag.name
                    from
                        tag
                    left join post_tag ON post_tag.post_id = post.id
                    where
                        post_tag.post_id = post.id
                        and tag.status = 1
                    limit
                        1
                ) AS tagsName
            `),
            )
            .leftJoin('post_media', 'post_media.post_id', '=', 'post.id')
            .leftJoin('media', 'media.id', '=', 'post_media.media_id')
            .where('post.status', Post.statusPublish)
            .limit(limit)

        return response.json({
            version: "1.0.0",
            encoding: "UTF-8",
            feed: {
                entry: this.newResponse(posts)
            }
        })
    }

    newResponse(posts: Post[]): any {
        let entrys: any = []
        for (const post of posts) {
            entrys.push({
                id: post.id,
                published: {
                    $t: post.createdAt
                },
                category: [
                    {
                        term: post?.$extras?.tagsName
                    }
                ],
                title: {
                    type: "text",
                    $t: post.title
                },
                link: [
                    {
                        rel: "alternate",
                        type: "text/html",
                        href: Route.makeUrl("frontend.post.show", { slug: `${post.slug}.html` }),
                        title: post.title
                    }
                ],
                media$thumbnail: {
                    url: post?.$extras?.mediaPath,
                }
            })
        }

        return entrys
    }
}
