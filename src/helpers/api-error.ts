export class ApiError  extends Error {
    public  readonly statusCode: number;
    public readonly result: boolean;
    constructor(message: string, statusCode:number) {
        super(message)
        this.statusCode = statusCode;
        this.result = false;
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string) {
        super(message,404);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string) {
        super(message, 401);
    }
}

export class ForbiddenError extends ApiError {
    constructor(message: string) {
        super(message, 403);
    }
}

export class MethodNotAllowedError extends ApiError {
    constructor(message: string) {
        super(message, 405);
    }
}

export class NotAcceptableError extends ApiError {
    constructor(message: string) {
        super(message, 406);
    }
}

export class ConflictError extends ApiError {
    constructor(message: string) {
        super(message, 409);
    }
}

export class GoneError extends ApiError {
    constructor(message: string) {
        super(message, 410);
    }
}

export class LengthRequiredError extends ApiError {
    constructor(message: string) {
        super(message, 411);
    }
}

export class PreconditionFailedError extends ApiError {
    constructor(message: string) {
        super(message, 412);
    }
}

export class PayloadTooLargeError extends ApiError {
    constructor(message: string) {
        super(message, 413);
    }
}