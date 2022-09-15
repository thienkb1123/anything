export default class Alert {
    static success: string = 'success'
    static error: string = 'error'
    static warn: string = 'warning'

    static create(message: string, type: string, redirectURL?: string): Option {
        return new Option(message, type, redirectURL)
    }
}

export class Option {
    title?: string
    message?: string
    type?: string
    redirectURL?: string

    constructor(message?: string, type?: string, redirectURL?: string) {
        this.title = this.getTitle(type as string)
        this.message = message
        this.type = type
        this.redirectURL = redirectURL
    }

    private getTitle(type: string): string {
        const titles: { [key: string]: string } = {
            'success': 'Successfully',
            'error': 'Failure',
            'warning': 'Warning'
        }
        return titles[type]
    }
}
