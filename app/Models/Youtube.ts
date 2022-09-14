import axios from 'axios'
export default class Youtube {

  static urlVideo = 'https://youtube.googleapis.com/youtube/v3/videos'
  static urlCommentThread = "https://youtube.googleapis.com/youtube/v3/commentThreads"
  static apiKey = 'AIzaSyAAnrsiYK5yIa4xs9vTDx-jYLktRmhGTD4'
  static part = 'snippet'
  static orderRelevance = 'relevance';

  static async getVideos(videoID: string): Promise<videos> {
    const req = await axios.get(this.urlVideo, {
      params: {
        part: this.part,
        id: videoID,
        key: this.apiKey
      }
    })
    return req.data as videos
  }

  static async getCommentsThread(videoID: string): Promise<commentThreads> {
    const req = await axios.get(this.urlCommentThread, {
      params: {
        part: this.part,
        videoId: videoID,
        key: this.apiKey,
        order: this.orderRelevance
      }
    })
    return req.data as commentThreads
  }

  static getThumbnail(thumbnails: videosItemSnippetThumbnail, defaultThumbnail: string): string {
    if (!thumbnails) {
        return defaultThumbnail
    }

    const valuePass = 1
    if (thumbnails.maxres && thumbnails.maxres.width > valuePass) return thumbnails.maxres.url
    if (thumbnails.standard && thumbnails.standard.width > valuePass) return thumbnails.standard.url
    if (thumbnails.high && thumbnails.high.width > valuePass) return thumbnails.high.url
    if (thumbnails.medium && thumbnails.medium.width > valuePass) return thumbnails.medium.url
    if (thumbnails.default && thumbnails.default.width > valuePass) return thumbnails.default.url

    return defaultThumbnail
}
}

interface videos {
  kind: string
  items: videosItem[]
}

interface videosItem {
  snippet: videosItemSnippet
}

interface videosItemSnippet {
  title: string
  description: string
  tags: string[]
  thumbnails: videosItemSnippetThumbnail
}

interface videosItemSnippetThumbnail {
  default: videosItemSnippetThumbnailAttibute
  medium: videosItemSnippetThumbnailAttibute
  high: videosItemSnippetThumbnailAttibute
  standard: videosItemSnippetThumbnailAttibute
  maxres: videosItemSnippetThumbnailAttibute
}

interface videosItemSnippetThumbnailAttibute {
  url: string
  width: number
  height: number
}

interface commentThreads {
  items: commentThreadItem[]
}

interface commentThreadItem {
  snippet: commentThreadItemSnippet
}

interface commentThreadItemSnippet {
  topLevelComment: commentThreadItemSnippetTopLevelComment
}


interface commentThreadItemSnippetTopLevelComment {
  snippet: commentThreadItemSnippetTopLevelCommentSnippet
}

interface commentThreadItemSnippetTopLevelCommentSnippet {
  textOriginal: string
}
