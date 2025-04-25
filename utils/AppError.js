export class AppError extends Error{

    constructor(message,statusCode){
        super(message),
        this.status = statusCode;
        this.functionalError = true;
        Error.captureStackTrace(this,this.constructor)
    }

}