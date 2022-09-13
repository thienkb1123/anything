/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'


Route.get('/', 'Frontend/HomeController.index')


// Admin
Route.any('/any-admin/login', 'Backend/AuthController.login').as('backend.auth.login')
Route.any('/any-admin/logout', 'Backend/AuthController.logout').as('backend.auth.logout')

Route.resource('/tess','Backend/AuthController')

Route.group(() => {
    Route.get('', 'Backend/HomeController.index').as('backend.home')

    Route.get('/profile/index', 'Backend/ProfileController.index').as('backend.profile.index')

    Route.group(() => {
        Route.get('/config', 'Backend/MakeContentToolConfigController.index').as('backend.tools.makecontent.config.index')
        Route.get('/config/create', 'Backend/MakeContentToolConfigController.create').as('backend.tools.makecontent.config.create')
        Route.post('/config', 'Backend/MakeContentToolConfigController.updateOrCreate').as('backend.tools.makecontent.config.store')
        Route.get('/config/:id', 'Backend/MakeContentToolConfigController.show').as('backend.tools.makecontent.config.show')
        Route.put('/config/:id', 'Backend/MakeContentToolConfigController.updateOrCreate').as('backend.tools.makecontent.config.update')

        // Route.any('/config/create', 'Backend/MakeContentToolConfigController.updateOrCreate').as('backend.makecontent.config.create')
        // Route.any('/config/update/:id', 'Backend/MakeContentToolConfigController.updateOrCreate').as('backend.makecontent.config.update')
        Route.get('/youtube', 'Backend/MakeContentFromYoutubeController.index').as('backend.makecontent.youtube.create')
    }).prefix('/tools/make-content')

}).prefix('/any-admin').middleware('auth')
