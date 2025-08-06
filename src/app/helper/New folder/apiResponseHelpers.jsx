import { NextResponse } from 'next/server';

export const successResponse = (message, data) => {
    return NextResponse.json({
        status: 200,
        message: message,
        data: data
    });
};

export const badRequestResponse = (message, data) => {
    return NextResponse.json({
        status: 400,
        message: message,
        data: data
    });
};

export const notFoundResponse = (message, data) => {
    return NextResponse.json({
        status: 404,
        message: message,
        data: data
    });
};

export const conflictResponse = (message, data) => {
    return NextResponse.json({
        status: 409,
        message: message,
        data: data
    });
};

export const unsupportedMediaTypeResponse = (message, data) => {
    return NextResponse.json({
        status: 415,
        message: message,
        data: data
    });
};

export const serverErrorResponse = (message) => {
    return NextResponse.json({
        status: 500,
        message: message
    });
};