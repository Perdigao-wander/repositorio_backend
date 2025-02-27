import {NextFunction, Request, Response} from "express";
import {ApiError} from "../helpers/api-error";

const errorMiddleware = (err:Error & Partial<ApiError>, req:Request, res:Response, next:NextFunction)=> {

    const statusCode = err.statusCode ?? 500
    const message = err.statusCode ? err.message : 'Internal Server Error';
    res.status(statusCode).json({
        result: false,
        message: message,
        sourceMessage:err.message,
        sourceStatus:err.statusCode
    })
}


export default errorMiddleware;