import url from 'url'
import slugify from "slugify";
import { DateTime } from 'luxon'

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

    static currentDateTime (): string {
        return DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
    }

}