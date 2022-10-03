import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GlobalsController {
    public async handle(
        { request }: HttpContextContract,
        next: () => Promise<void>
    ) {
        console.log(`-> ${request.method()}: ${request.url()}`)
        await next()
    }
}
