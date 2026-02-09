export function ok(res, data, meta) {
    return res.status(200).json({
        success: true,
        data, 
        error: null,
        meta: meta ?? null
    })
}

export function created(res, data, meta) {
    return res.status(201).json({   
        success: true,
        data,
        error: null,
        meta: null
    })
}

export function fail(res, statusCode, code, message, details) {
    return res.status(statusCode).json({
        success:false,
        data: null,
        error: {
            code: code ?? 'ERROR',
            message: message ?? 'Something went wrong',
            details: details ?? null
        },
        meta: null
    })
}

