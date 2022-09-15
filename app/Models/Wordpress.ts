import axios from 'axios'
import { ResponseType, AxiosRequestHeaders } from 'axios'

export default class WordPress {
  static urlCreateMedia: string = 'https://rereview.info/wp-json/wp/v2/media'
  static urlCreatePost: string = 'https://rereview.info/wp-json/wp/v2/posts?_embed=1'
  static urlListCategories: string = '/wp-json/wp/v2/categories?orderby=count&per_page=100'
  static urlListTags: string = '/wp-json/wp/v2/tags?orderby=count&per_page=100'

  static contentTypeJSON: string = 'application/json'
  static contentTypeImage: string = 'image/jpeg'
  static responseTypeStream: ResponseType = 'stream'

  static async createMedia(APIKey: string, imageAddr: string, fileName: string): Promise<Media> {
    const imageStream = await axios.get(imageAddr, { responseType: this.responseTypeStream })
    const headers: AxiosRequestHeaders = {
      'Authorization': `Basic ${APIKey}`,
      'Content-Type': this.contentTypeImage,
      'Content-Disposition': `attachment; filename=${fileName}.jpg`
    }
    const req = await axios.post(this.urlCreateMedia, imageStream.data, { headers: headers })
    return req.data
  }

  static async createPost(APIKey: string, data: object): Promise<object> {
    const headers: AxiosRequestHeaders = {
      'Authorization': `Basic ${APIKey}`,
      'Content-Type': this.contentTypeJSON
    }
    const req = await axios.post(this.urlCreatePost, JSON.stringify(data), { headers: headers })
    return req.data
  }

  static async listCategories(siteAdrr: string): Promise<Category[]> {
    const url: string = siteAdrr + this.urlListCategories
    const req = await axios.get(url)
    return req.data as Category[]
  }

  static async listTags(siteAdrr: string): Promise<Tag[]> {
    const url: string = siteAdrr + this.urlListTags
    const req = await axios.get(url)
    return req.data as Tag[]
  }
}

export interface Media {
  id: number
}

export interface Category {
  id: number
  name: string
}

export interface Tag {
  id: number
  name: string
}