// src/interfaces/api.interface.ts

/**
 * Standard API response interface
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

/**
 * Standard API error response
 */
export interface ApiError {
    success: false;
    message: string;
    errors?: string[];
}

/**
 * Pagination metadata interface
 */
export interface PaginationMeta {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

/**
 * Search filter interface
 */
export interface SearchFilter {
    query?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}