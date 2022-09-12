import axios from 'axios'
export default class Youtube {

  private urlVideo = 'https://youtube.googleapis.com/youtube/v3/videos'
  private urlCommentThread = "https://youtube.googleapis.com/youtube/v3/commentThreads"
  private apiKey = 'AIzaSyAAnrsiYK5yIa4xs9vTDx-jYLktRmhGTD4'
  private part = 'snippet'
  private orderRelevance = 'relevance';

  public async getVideo(videoID: string): Promise<object> {
    const req = await axios.get(this.urlVideo, {
      params: {
        part: this.part,
        id: videoID,
        key: this.apiKey
      }
    })
    return req.data
  }

  public async getCommentsThread(videoID: string): Promise<object> {
    const req = await axios.get(this.urlCommentThread, {
      params: {
        part: this.part,
        videoId: videoID,
        key: this.apiKey,
        order: this.orderRelevance
      }
    })
    return req.data
  }
}

// class Videos {
//   public kind: string
//   public items: CommentsThreadItem[]
// }

// class VideosItem {
//   public snippet: CommentsThreadItemTopLevelComment
// }

// class VideosItemSnippet{
//   public snippet: CommentsThreadItemTopLevelCommentSnippet
// }

// class CommentsThreadItemTopLevelCommentSnippet {
//   public textOriginal: string
// }

// class CommentsThread {
//   public kind: string
//   public items: CommentsThreadItem[]
// }

// class CommentsThreadItem {
//   public snippet: CommentsThreadItemTopLevelComment
// }

// class CommentsThreadItemTopLevelComment {
//   public snippet: CommentsThreadItemTopLevelCommentSnippet
// }

// class CommentsThreadItemTopLevelCommentSnippet {
//   public textOriginal: string
// }