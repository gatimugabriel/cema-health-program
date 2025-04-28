export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
    }
}

export interface StandardResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}
