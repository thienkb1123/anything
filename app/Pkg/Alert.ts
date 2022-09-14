export default class Alert {

    titles: string
    constructor() {
        this.titles = '12321'
    }

    static getSuccessType(): string {
        return 'success'
    }

    static getErrorType(): string {
        return 'success'
    }

    static create(): string {
        return 'success'
    }
}