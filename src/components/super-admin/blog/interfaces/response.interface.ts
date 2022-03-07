import { Blog } from './blog.interfaces';
import { PaginateResult } from 'mongoose';

export interface IBlogResponse {
    success: boolean;
    data: Blog | Blog[] | PaginateResult<Blog>;
    error: Error;
    message: string[];
    statusCode: number;
}
