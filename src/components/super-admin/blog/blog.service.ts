import { InjectModel } from '@nestjs/mongoose';
import { Err } from 'src/@core/interfaces/error.interface';
import { Blog } from './interfaces/blog.interfaces';
import { BlogDto } from './dto/blog.dto';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { Model, PaginateModel } from 'mongoose';
import { BLOG_CONSTANT } from 'src/@core/constants/api-error-constants';

@Injectable()
export class BlogService {
    constructor(@InjectModel('Blog') private readonly pBlogModel: PaginateModel<Blog>, @InjectModel('Blog') private readonly blogModel: Model<Blog>) {}

    async create(blogDto: BlogDto, userId: string): Promise<Blog | Err> {
        const blog = new this.blogModel(blogDto);
        blog.userId = userId;
        const isBlogUrlUnique = await this.isBlogUnique(blog.url);
        if (!isBlogUrlUnique) throw new BadRequestException([BLOG_CONSTANT.BLOG_URL_HAS_ALREADY_BEEN_USED, blog.url]); //Old format (`${blog.url} has already been used`)
        const blogData = blog.save();
        return blogData;
    }

    async isBlogUnique(url: string) {
        const blog = await this.blogModel.findOne({ url });
        if (blog) {
            return false;
        }
        return true;
    }

    async findBlogDetail(req: Request): Promise<Blog | Err> {
        const { blogurl } = req.query;
        const query = { url: blogurl + '', status: true };
        const blog = await this.blogModel.findOne(query);
        if (!blog) throw new NotFoundException(BLOG_CONSTANT.REQUESTED_BLOG_CANNOT_BE_FOUND);
        return blog;
    }

    async findBlogDetailAdmin(blogurl: string): Promise<Blog | Err> {
        const query = { url: blogurl };
        const blog = await this.blogModel.findOne(query);
        if (!blog) throw new NotFoundException(BLOG_CONSTANT.REQUESTED_BLOG_CANNOT_BE_FOUND);
        return blog;
    }

    async findAllBlog(req: Request): Promise<any> {
        const { page, limit, status } = req.query;
        const query = {};
        if (status && status === 'active') {
            query['status'] = true;
        }
        if (status && status === 'inactive') {
            query['status'] = false;
        }
        const options = {
            select: 'title url createdAt updatedAt',
            sort: { updatedAt: -1 }
        };
        if (Object.keys(req).length > 0 && page && limit) {
            options['limit'] = Number(limit);
            options['page'] = Number(page);
        }
        return await this.pBlogModel.paginate(query, options);
    }

    async deleteBlog(req: Request): Promise<any> {
        const { blogurl } = req.query;
        const query = { url: blogurl + '', status: true };
        const blog = await this.blogModel.findOne(query);
        if (blog) {
            await blog.updateOne({ status: false });
        } else {
            throw new NotFoundException(BLOG_CONSTANT.REQUESTED_BLOG_CANNOT_BE_FOUND);
        }
        return;
    }

    async updateBlog(blogurl: string, blogDto: BlogDto, req: Request): Promise<any> {
        const userId = req['user']._id;
        const oldBlog = await this.pBlogModel.findOne({ url: <string>blogurl });
        const blogByURL = await this.pBlogModel.findOne({ url: blogDto.url });
        if (blogByURL && blogByURL.id !== oldBlog.id) throw new BadRequestException([BLOG_CONSTANT.BLOG_URL_HAS_ALREADY_BEEN_USED, blogDto.url]); //Old format (`${blogDto.url} has already been used`)
        if (oldBlog) {
            await oldBlog.updateOne({ ...blogDto, userId: userId });
        } else {
            throw new Error(BLOG_CONSTANT.UPDATE_BLOG_FAILED);
        }
        return await this.pBlogModel.findById(oldBlog.id);
    }
}
