import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import View from '@ioc:Adonis/Core/View'


const axios = require('axios')

class MakeYtbContentsController {
    public async index(ctx: HttpContextContract) {
        
       const result = await axios.get('https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=gFg_gqPWmt4&key=AIzaSyAAnrsiYK5yIa4xs9vTDx-jYLktRmhGTD4')

       console.log(result.data.items)




        const html = await View.render('home', {
            greeting: 'Hello'
        })
        return html
    }
}

export default MakeYtbContentsController;