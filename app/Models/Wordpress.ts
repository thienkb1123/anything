import axios from 'axios'
import { ResponseType, AxiosRequestHeaders } from 'axios'

export default class Wordpress {
  private urlCreateMedia: string = 'https://rereview.info/wp-json/wp/v2/media'
  private urlCreatePost: string = 'https://rereview.info/wp-json/wp/v2/posts?_embed=1'
  private responseTypeStream: ResponseType = 'stream'

  public async createMedia(imageAddr: string, fileName: string): Promise<object> {
    const imageStream = await axios.get(imageAddr, { responseType: this.responseTypeStream })
    const headers: AxiosRequestHeaders = {
      'Authorization': 'Basic dGhpZW5kejpnSShaQnBpJE5Tc15hQDRPZDZlSGokME0=',
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename=${fileName}.jpg`
    }
    const req = await axios.post(this.urlCreateMedia, imageStream.data, { headers: headers })
    return req.data
  }

  public async createPost(data: object): Promise<object> {
    const headers: AxiosRequestHeaders = {
      'Authorization': 'Basic dGhpZW5kejpnSShaQnBpJE5Tc15hQDRPZDZlSGokME0=',
      'Content-Type': 'application/json'
    }
    const req = await axios.post(this.urlCreatePost, JSON.stringify(data), { headers: headers })
    return req.data
  }
}
