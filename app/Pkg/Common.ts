import url from 'url'
import slugify from "slugify";

export default class Common {

    static getVideoIDYoutubeFromLink(urlAdrr: string): string {
        const reqUrl = url.parse(urlAdrr, true)
        return reqUrl.query.v as string
    }

    static makeSlug(str: string): string {
        return slugify(str, {
            replacement: '-',
            remove: undefined,
            lower: true,
            strict: false,
            locale: 'vi',
            trim: true
        })
    }

    static makeFileName(str: string): string {
        return slugify(str, {
            replacement: '_',
            remove: undefined,
            lower: true,
            strict: false,
            locale: 'vi',
            trim: true
        })
    }

}