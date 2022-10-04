import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Route from '@ioc:Adonis/Core/Route'
import PostValidator from 'App/Validators/PostValidator'
import Alert from 'App/Pkg/Alert'
import Common from 'App/Pkg/Common'
import Client from 'App/Pkg/Client'
import Post from 'App/Models/Post'
import PostTag from 'App/Models/PostTag'
import PostCategory from 'App/Models/PostCategory'
import PostMedia from 'App/Models/PostMedia'

export default class PostController {
    async index({ request, auth, view }: HttpContextContract) {
        const limit = 10
        const page = request.input('page', 1)
        const posts = await Post.query()
            .where('status', '<>', Post.statusDelete)
            .where('author', auth.user?.id)
            .paginate(page, limit)

        return view.render('backend.post.index', {
            title: 'List posts',
            posts: posts
        })
    }

    async create({ view }: HttpContextContract) {
        return view.render('backend.post.curd', {
            title: 'Create a post',
            formActionURL: Route.makeUrl('backend.post.store'),
        })
    }

    async store({ request, response, session, auth }: HttpContextContract) {
        const payload = await request.validate(PostValidator)
        try {
            const post = await Post.create({
                author: auth.user?.id as number,
                title: payload.title,
                slug: request.input('slug'),
                summary: payload.summary,
                content: payload.content,
                status: request.input('status') as number,
            })

            const tags = request.input('tags') || []
            this.setPostTags(post.id, tags)

            const categories = request.input('categories') || []
            this.setPostCategories(post.id, categories)

            const mediaID = Number(request.input('mediaID'))
            this.setPostMedia(post.id, mediaID)

            session.flash('alert', Alert.create('Create successfully', Alert.success))
        } catch (error) {
            session.flash('alert', Alert.create("Create failure. Let's try", Alert.error))
        }
        return response.redirect().toRoute('backend.post.index')
    }

    async edit({ request, response, auth, view }: HttpContextContract) {
        const id = request.param('id')
        if (!id) {
            return response.redirect().toRoute('backend.post.index')
        }

        const post = await Post.query()
            .select(
                'post.id',
                'post.title',
                'post.slug',
                'post.summary',
                'post.content',
                'post.status',
                'media.id as mediaID',
                'media.path as mediaPath',
                Database.raw('GROUP_CONCAT(post_tag.tag_id) as tagsID'),
                Database.raw('GROUP_CONCAT(post_category.category_id) as categoriesID')
            )
            .where('post.id', id)
            .leftJoin('post_tag', 'post_tag.post_id', '=', 'post.id')
            .leftJoin('post_category', 'post_category.post_id', '=', 'post.id')
            .leftJoin('post_media', 'post_media.post_id', '=', 'post.id')
            .leftJoin('media', 'media.id', '=', 'post_media.media_id')
            .where('post.author', auth.user?.id)
            .firstOrFail()

        return view.render('backend.post.curd', {
            formActionURL: Route.makeUrl('backend.post.update', { id: id }, { qs: { _method: 'PUT' } }),
            post: post,
            title: 'Edit a post',
        })
    }

    async update({ request, response, auth, session }: HttpContextContract) {
        const id = request.param('id')
        if (!id) {
            return response.redirect().toRoute('backend.post.index')
        }

        const payload = await request.validate(PostValidator)
        try {
            await Post.query()
                .where('id', id)
                .where('author', auth.user?.id)
                .update({
                    title: payload.title,
                    slug: request.input('slug'),
                    summary: payload.summary,
                    content: payload.content,
                    status: request.input('status') as number,
                })

            const tags = request.input('tags') || []
            this.setPostTags(id, tags)

            const categories = request.input('categories') || []
            this.setPostCategories(id, categories)

            const mediaID = Number(request.input('mediaID'))
            this.setPostMedia(id, mediaID)

            session.flash('alert', Alert.create('Edit successfully', Alert.success))
        } catch (error) {
            console.log(error)
            session.flash('alert', Alert.create("Edit failure. Let's try", Alert.error))
        }

        return response.redirect().toRoute('backend.post.index')
    }

    async destroy({ request, response, auth }: HttpContextContract) {
        const id = request.param('id')
        if (!id) {
            return response.redirect().toRoute('backend.post.index')
        }

        try {
            await Post.query()
                .where('id', id)
                .where('author', auth.user?.id)
                .update({
                    status: Post.statusDelete,
                    updated_at: Common.currentDateTime()
                })
        } catch (error) {
            return response.json(Client.NewRespJSON(Client.codeError, Client.messageError))
        }
        return response.json(Client.NewRespJSON(Client.codeOk, Client.messageOk, { id: id }))
    }

    async status({ request, response, auth }: HttpContextContract) {
        const id = request.param('id')
        if (!id) {
            return response.redirect().toRoute('backend.post.index')
        }
        try {
            await Post.query()
                .where('id', id)
                .where('author', auth.user?.id)
                .update({
                    status: Number(request.input('status')),
                    updated_at: Common.currentDateTime()
                })
        } catch (error) {
            return response.json(Client.NewRespJSON(Client.codeError, Client.messageError))
        }
        return response.json(Client.NewRespJSON(Client.codeOk, Client.messageOk, { id: id }))
    }

    async setPostTags(postID: number, tags: string[]) {
        const postTags = await PostTag.query()
            .select(Database.raw('GROUP_CONCAT(tag_id) as tagsID'))
            .where('post_id', postID)
            .firstOrFail()

        const oldTags = String(postTags?.$extras.tagsID).split(',')
        const tagsDelete = oldTags.filter(val => !tags.includes(val));
        if (tagsDelete.length) {
            await PostTag.query().where('post_id', postID).whereIn('tag_id', tagsDelete).delete()
        }

        for (const tag of tags) {
            await PostTag.updateOrCreate(
                { postID: postID, tagID: Number(tag) },
                { postID: postID, tagID: Number(tag) }
            )
        }
    }

    async setPostCategories(postID: number, categories: string[]) {
        const postCategories = await PostCategory.query()
            .select(Database.raw('GROUP_CONCAT(category_id) as categoriesID'))
            .where('post_id', postID)
            .firstOrFail()

        const oldCategories = String(postCategories?.$extras.categoriesID).split(',')
        const categoriesDelete = oldCategories.filter(val => !categories.includes(val));
        if (categoriesDelete.length) {
            await PostCategory.query().where('post_id', postID).whereIn('category_id', categoriesDelete).delete()
        }

        for (const category of categories) {
            try {
                await PostCategory.updateOrCreate(
                    { postID: postID, categoryID: Number(category) },
                    { postID: postID, categoryID: Number(category) }
                )
            } catch (error) {
                console.log(error)
            }
        }
    }

    async setPostMedia(postID: number, mediaID: number) {
        const postMedia = await PostMedia.query()
            .select('media_id')
            .where('post_id', postID)
            .first()

        if (postMedia && postMedia.mediaID != mediaID) {
            await PostMedia.query().where('post_id', postID).delete()
        }

        await PostMedia.updateOrCreate(
            { postID: postID, mediaID: mediaID },
            { postID: postID, mediaID: mediaID }
        )
    }
}
