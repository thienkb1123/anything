import axios from 'axios'
import { ResponseType, AxiosRequestHeaders } from 'axios'

export default class WordPress {
  static urlCreateMedia: string = 'https://rereview.info/wp-json/wp/v2/media'
  static urlCreatePost: string = 'https://rereview.info/wp-json/wp/v2/posts?_embed=1'
  static urlListCategories: string = '/wp-json/wp/v2/categories?orderby=count&per_page=100'
  static urlListTags: string = '/wp-json/wp/v2/tags?orderby=count&per_page=100'

  static contentTypeJSON: string = 'application/json'
  static responseTypeStream: ResponseType = 'stream'



  static async createMedia(imageAddr: string, fileName: string): Promise<object> {
    const imageStream = await axios.get(imageAddr, { responseType: this.responseTypeStream })
    const headers: AxiosRequestHeaders = {
      'Authorization': 'Basic dGhpZW5kejpnSShaQnBpJE5Tc15hQDRPZDZlSGokME0=',
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename=${fileName}.jpg`
    }
    const req = await axios.post(this.urlCreateMedia, imageStream.data, { headers: headers })
    return req.data
  }

  static async createPost(data: object): Promise<object> {
    const headers: AxiosRequestHeaders = {
      'Authorization': 'Basic dGhpZW5kejpnSShaQnBpJE5Tc15hQDRPZDZlSGokME0=',
      'Content-Type': this.contentTypeJSON
    }
    const req = await axios.post(this.urlCreatePost, JSON.stringify(data), { headers: headers })
    return req.data
  }

  static async listCategories(siteAdrr: string): Promise<category[]> {
    const url: string = siteAdrr + this.urlListCategories
    const req = await axios.get(url)
    return req.data as category[]
  }

  static async listTags(siteAdrr: string): Promise<tag[]> {
    const url: string = siteAdrr + this.urlListTags
    const req = await axios.get(url)
    return req.data as tag[]
  }
}

interface category {
  id: number
  name: string
}

interface tag {
  id: number
  name: string
}