import url from 'url'
import slugify from "slugify";

export function getYoutubeVideoID(urlAdrr: string): string {
    const reqUrl = url.parse(urlAdrr, true)
    return reqUrl.query.v as string
}

export function getYoutubeThumbnail(thumbnails: object, defaultThumbnail: string): string {
    if (!thumbnails) {
        return defaultThumbnail
    }

    const valuePass = 1
    if (thumbnails.maxres && thumbnails.maxres.width > valuePass) return thumbnails.maxres.url
    if (thumbnails.standard && thumbnails.standard.width > valuePass) return thumbnails.standard:.url
    if (thumbnails.high && thumbnails.high.width > valuePass) return thumbnails.high.url
    if (thumbnails.medium && thumbnails.medium.width > valuePass) return thumbnails.medium.url
    if (thumbnails.default && thumbnails.default.width > valuePass) return thumbnails.default.url

    return defaultThumbnail
}

export function makeSlug(str: string): string {
    return slugify(str, {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: false,
        locale: 'vi',
        trim: true
    })
}
export function makeFileName(str: string): string {
    return slugify(str, {
        replacement: '_',
        remove: undefined,
        lower: true,
        strict: false,
        locale: 'vi',
        trim: true 
    })
}