import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import Admin from 'App/Models/Admin'

export default class AuthController {

    public async login({ request, response, auth, view, session }: HttpContextContract) {
        if (request.method() === 'POST') {
            const email = request.input('email')
            const password = request.input('password')
            try {
                const admin = await Admin
                    .query()
                    .where('email', email)
                    .where('status', 1)
                    .firstOrFail()

                // Verify password
                if (!(await Hash.verify(admin.password, password))) {
                    session.flash('errorMessage', 'Your email or password is incorrect')
                    return response.redirect().back()
                }

                // Create session
                await auth.use('web').login(admin)
                return response.redirect('/any-admin')
            } catch (error) {
                session.flash('errorMessage', 'Your email or password is incorrect')
                return response.redirect().back()
            }
        }

        return view.render('backend.login.login', {
            params: request.all(),
        })
    }

    public async logout({ response, auth }: HttpContextContract) {
        await auth.use('web').logout()
        return response.redirect('/any-admin/login')
    }

}

