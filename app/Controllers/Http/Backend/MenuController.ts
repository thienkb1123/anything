import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Route from '@ioc:Adonis/Core/Route'
import MenuValidator from 'App/Validators/MenuValidator'
import Menu from 'App/Models/Menu'
import MenuCategory from 'App/Models/MenuCategory'
import Alert from 'App/Pkg/Alert'
import Client from 'App/Pkg/Client'
import Common from 'App/Pkg/Common'

export default class MenuController {
    async index({ request, auth, view }: HttpContextContract) {
        const limit = 10
        const page = request.input('page', 1)
        const menuList = await Menu.query()
            .where('status', '<>', Menu.statusDelete)
            .where('author', auth.user?.id)
            .paginate(page, limit)

        return view.render('backend.menu.index', {
            title: 'Menu',
            menuList: menuList,
        })
    }

    async create({ view }: HttpContextContract) {
        const parents = await Menu.query()
            .select('id', 'name')
            .where('parent_id', 0)

        return view.render('backend.menu.curd', {
            title: 'Create a menu',
            formActionURL: Route.makeUrl('backend.menu.store'),
            parents: parents,
        })
    }

    async edit({ request, response, auth, view }: HttpContextContract) {
        const id = request.param('id')
        if (!id) {
            return response.redirect().toRoute('backend.post.index')
        }

        const menu = await Menu.query()
            .select(
                'menu.id',
                'menu.parent_id',
                'menu.name',
                'menu.slug',
                'menu.status',
                Database.raw('GROUP_CONCAT(menu_category.category_id) as categoriesID')
            )
            .leftJoin('menu_category', 'menu_category.menu_id', '=', 'menu.id')
            .where('menu.id', id)
            .where('menu.author', auth.user?.id)
            .firstOrFail()

        const parents = await Menu.query()
            .select('id', 'name')
            .where('parent_id', 0)

        return view.render('backend.menu.curd', {
            formActionURL: Route.makeUrl('backend.menu.update', { id: id }, { qs: { _method: 'PUT' } }),
            menu: menu,
            parents: parents,
            title: 'Edit a menu',
        })
    }

    async store({ request, response, session, auth }: HttpContextContract) {
        const payload = await request.validate(MenuValidator)
        try {
            const menu = await Menu.create({
                author: Number(auth.user?.id as number),
                parentID: Number(request.input('parentID')),
                name: payload.name,
                slug: request.input('slug'),
                status: Number(request.input('status')),
            })

            const categories = request.input('categories') || []
            this.setMenuCategories(menu.id, categories)

            session.flash('alert', Alert.create('Create successfully', Alert.success))
        } catch (error) {
            console.log(error)
            session.flash('alert', Alert.create("Create failure. Let's try", Alert.error))
        }
        return response.redirect().toRoute('backend.menu.index')
    }

    async update({ request, response, auth, session }: HttpContextContract) {
        const id = request.param('id')
        if (!id) {
            return response.redirect().toRoute('backend.post.index')
        }

        const payload = await request.validate(MenuValidator)
        try {
            await Menu.query()
                .where('id', id)
                .where('author', auth.user?.id)
                .update({
                    parentID: Number(request.input('parentID')),
                    name: payload.name,
                    slug: request.input('slug'),
                    status: Number(request.input('status') as number),
                })

            const categories = request.input('categories') || []
            this.setMenuCategories(id, categories)

            session.flash('alert', Alert.create('Edit successfully', Alert.success))
        } catch (error) {
            console.log(error)
            session.flash('alert', Alert.create("Edit failure. Let is try", Alert.error))
        }

        return response.redirect().toRoute('backend.menu.index')
    }

    async destroy({ request, response, auth }: HttpContextContract) {
        const id = request.param('id')
        if (!id) {
            return response.redirect().toRoute('backend.menu.index')
        }

        try {
            await Menu.query()
                .where('id', id)
                .where('author', auth.user?.id)
                .update({
                    status: Menu.statusDelete,
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
            return response.redirect().toRoute('backend.menu.index')
        }
        try {
            await Menu.query()
                .where('id', id)
                .where('author', auth.user?.id)
                .update({
                    status: Number(Number(request.input('status'))),
                    updated_at: Common.currentDateTime()
                })
        } catch (error) {
            return response.json(Client.NewRespJSON(Client.codeError, Client.messageError))
        }
        return response.json(Client.NewRespJSON(Client.codeOk, Client.messageOk, { id: id }))
    }

    async setMenuCategories(menuID: number, categories: string[]) {
        const menuCategories = await MenuCategory.query()
            .select(Database.raw('GROUP_CONCAT(category_id) as categoriesID'))
            .where('menu_id', menuID)
            .firstOrFail()

        const oldCategories = String(menuCategories?.$extras.categoriesID).split(',')
        const categoriesDelete = oldCategories.filter(val => !categories.includes(val));
        if (categoriesDelete.length) {
            await MenuCategory.query().where('menu_id', menuID).whereIn('category_id', categoriesDelete).delete()
        }

        for (const category of categories) {
            try {
                await MenuCategory.updateOrCreate(
                    { menuID: menuID, categoryID: Number(category) },
                    { menuID: menuID, categoryID: Number(category) }
                )
            } catch (error) {
                console.log(error)
            }
        }
    }
}
