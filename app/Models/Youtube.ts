import axios from 'axios'
export default class Youtube {

  static urlVideo = 'https://youtube.googleapis.com/youtube/v3/videos'
  static urlCommentThread = "https://youtube.googleapis.com/youtube/v3/commentThreads"
  static part = 'snippet'
  static orderRelevance = 'relevance';

  static async getVideos(APIKey: string, videoID: string): Promise<Videos> {
    const req = await axios.get(this.urlVideo, {
      params: {
        part: this.part,
        id: videoID,
        key: APIKey
      }
    })
    return req.data as Videos
  }

  static async getCommentsThread(APIKey: string, videoID: string): Promise<CommentThreads> {
    const req = await axios.get(this.urlCommentThread, {
      params: {
        part: this.part,
        videoId: videoID,
        key: APIKey,
        order: this.orderRelevance
      }
    })
    return req.data as CommentThreads
  }

  static getThumbnail(thumbnails: VideosItemSnippetThumbnail, defaultThumbnail: string): string {
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

interface Videos {
  kind: string
  items: VideosItem[]
}

interface VideosItem {
  snippet: VideosItemSnippet
}

interface VideosItemSnippet {
  title: string
  description: string
  tags: string[]
  thumbnails: VideosItemSnippetThumbnail
}

interface VideosItemSnippetThumbnail {
  default: VideosItemSnippetThumbnailAttibute
  medium: VideosItemSnippetThumbnailAttibute
  high: VideosItemSnippetThumbnailAttibute
  standard: VideosItemSnippetThumbnailAttibute
  maxres: VideosItemSnippetThumbnailAttibute
}

interface VideosItemSnippetThumbnailAttibute {
  url: string
  width: number
  height: number
}

interface CommentThreads {
  items: CommentThreadItem[]
}

interface CommentThreadItem {
  snippet: CommentThreadItemSnippet
}

interface CommentThreadItemSnippet {
  topLevelComment: CommentThreadItemSnippetTopLevelComment
}


interface CommentThreadItemSnippetTopLevelComment {
  snippet: CommentThreadItemSnippetTopLevelCommentSnippet
}

interface CommentThreadItemSnippetTopLevelCommentSnippet {
  textOriginal: string
}
