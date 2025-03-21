export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export const handleApiError = (err, fallbackStatus = 500) => {
    return {
        status: err.status || fallbackStatus,
        body: { error: err.message || 'Internal Server Error' }
    };
};
