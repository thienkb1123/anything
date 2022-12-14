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

Route.resource('/tess', 'Backend/AuthController')

Route.group(() => {
    Route.get('', 'Backend/HomeController.index').as('home')

    Route.get('/profile/index', 'Backend/ProfileController.index').as('profile.index')

    Route.group(() => {
        Route.get('/config', 'Backend/MakeContentToolConfigController.index').as('tools.makecontent.config.index')
        Route.get('/config/create', 'Backend/MakeContentToolConfigController.create').as('tools.makecontent.config.create')
        Route.post('/config', 'Backend/MakeContentToolConfigController.store').as('tools.makecontent.config.store')
        Route.get('/config/:id', 'Backend/MakeContentToolConfigController.show').as('tools.makecontent.config.show')
        Route.put('/config/:id', 'Backend/MakeContentToolConfigController.update').as('tools.makecontent.config.update')
        Route.delete('/config/:id', 'Backend/MakeContentToolConfigController.destroy').as('tools.makecontent.config.destroy')

        Route.get('/youtube', 'Backend/MakeContentFromYoutubeController.create').as('tools.makecontent.youtube.create')
        Route.post('/youtube', 'Backend/MakeContentFromYoutubeController.store').as('tools.makecontent.youtube.store')
        Route.get('/youtube/info-create-post', 'Backend/MakeContentFromYoutubeController.infoCreatePost').as('tools.makecontent.youtube.infoCreatePost')

    }).prefix('/tools/make-content')

    Route.group(() => {
        Route.resource('/config', 'Backend/PostTool/ConfigController').only(['create', 'index', 'store', 'show', 'update', 'destroy'])
        
        Route.resource('/wordpress', 'Backend/PostTool/WordPressController').only(['create', 'store'])
        Route.get('/wordpress/info-create-post', 'Backend/PostTool/WordPressController.infoCreatePost').as('wordpress.info-create-post')
    }).prefix('/post-tool').as('post-tool')

}).prefix('/any-admin').as('backend').middleware('auth')
