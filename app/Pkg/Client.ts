

export default class Client {
    public static codeOk: number = 0
    public static codeError: number = 1
    public static codeBadRequest: number = 400

    public static messageOk: string = 'Success'
    public static messageError = 'Fail'
    public static messageBadRequest: string = 'Bad request'

    public static NewRespJSON(code: number, message: string, data?: any): RespJSON {
        return { code: code, message: message, result: data || {} }
    }
}

type RespJSON = {
    code: number
    message: string
    result: any
}