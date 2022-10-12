import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Route from '@ioc:Adonis/Core/Route'
import Post from 'App/Models/Post'
import Tag from 'App/Models/Tag'
import { format } from 'mysql2'

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
                Database.raw(`group_concat(tag.name) as tagsName`)
            )
            .leftJoin('post_media', 'post_media.post_id', '=', 'post.id')
            .leftJoin('media', 'media.id', '=', 'post_media.media_id')
            .leftJoin('post_tag', 'post_tag.post_id', '=', 'post.id')
            .leftJoin('tag', 'tag.id', '=', 'post_tag.tag_id')
            .where('post.slug', slug)
            .where('post.status', Post.statusPublish)
            .firstOrFail()

        return view.render('frontend.post.detail', {
            post: post,
            title: post?.title,
        })
    }

    async feeds({ request, response }: HttpContextContract) {
        const tagsName = request.input('tagsName', '')
        const limit = request.input('limit', 4) as number
        const query = Post.query()
            .select(
                'post.id',
                'post.title',
                'post.slug',
                'post.summary',
                'post.created_at',
                'media.path as mediaPath',
                Database.raw(`group_concat(tag.name) as tagsName`)
            )
            .leftJoin('post_media', 'post_media.post_id', '=', 'post.id')
            .leftJoin('media', 'media.id', '=', 'post_media.media_id')
            .leftJoin('post_tag', 'post_tag.post_id', '=', 'post.id')
            .leftJoin('tag', 'tag.id', '=', 'post_tag.tag_id')
            .where('post.status', Post.statusPublish)
        if (tagsName) {
            query.whereIn('tag.name', tagsName.split(','))
        }
        const posts = await query.groupBy('post.id').limit(limit)
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
            console.log(post)
            let categories: any = []
            if (post?.$extras?.tagsName) {
                for (const tag of post?.$extras?.tagsName.split(',')) {
                    categories.push({
                        term: tag
                    })
                }
            }
            entrys.push({
                id: post.id,
                published: {
                    $t: post.createdAt
                },
                category: categories,
                title: {
                    type: "text",
                    $t: post.title
                },
                content: {
                    type: "text",
                    $t: post.summary
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
