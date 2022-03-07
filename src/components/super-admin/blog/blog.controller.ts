import { BlogService } from './blog.service';
import { BlogDto } from './dto/blog.dto';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/components/auth/decorators/roles.decorator';
import { Request } from 'express';
import { ResponseDto } from './dto/response';
import { PermissionGuard } from 'src/components/auth/guards/permission.guard';
import { Permission } from 'src/components/auth/decorators/permission.decorator';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { Feature } from 'src/components/auth/decorators/feature.decorator';
import { BLOG_CONSTANT } from 'src/@core/constants/api-error-constants';

@ApiTags('New Blog')
@UseGuards(RolesGuard)
@Controller('admin/blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.MANAGE_BLOG)
    @Roles(ROLE.SUPER_ADMIN)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create Blog' })
    @ApiCreatedResponse({})
    async register(@Body() blogDto: BlogDto, @Req() req: Request): Promise<any> {
        try {
            return new ResponseDto(true, HttpStatus.CREATED, [BLOG_CONSTANT.NEW_BLOG_CREATED], await this.blogService.create(blogDto, req['user'].id));
        } catch (err) {
            throw new BadRequestException(BLOG_CONSTANT.FAILED_TO_ADD_NEW_BLOG, err);
        }
    }

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get Blog' })
    async getBlogDetail(@Req() req: Request): Promise<any> {
        try {
            return new ResponseDto(true, HttpStatus.CREATED, [BLOG_CONSTANT.BLOG_DETAIL_FOUND], await this.blogService.findBlogDetail(req));
        } catch (err) {
            throw new NotFoundException(BLOG_CONSTANT.CANNOT_GET_BLOG, err);
        }
    }

    @Get('all')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.MANAGE_BLOG)
    @Roles(ROLE.SUPER_ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get Blog' })
    async getAllBlogList(@Req() req: Request): Promise<any> {
        try {
            return new ResponseDto(true, HttpStatus.CREATED, [BLOG_CONSTANT.BLOGS_LIST_FOUND], await this.blogService.findAllBlog(req));
        } catch (err) {
            throw new NotFoundException(BLOG_CONSTANT.CANNOT_GET_BLOGS, err);
        }
    }

    @Get(':url')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.MANAGE_BLOG)
    @Roles(ROLE.SUPER_ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get Blog Admin' })
    async getBlogDetailAdmin(@Param('url') blogurl: string): Promise<any> {
        try {
            return new ResponseDto(true, HttpStatus.CREATED, [BLOG_CONSTANT.BLOG_DETAIL_FOUND], await this.blogService.findBlogDetailAdmin(blogurl));
        } catch (err) {
            throw new NotFoundException(BLOG_CONSTANT.CANNOT_GET_BLOG, err);
        }
    }

    @Delete()
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permission(ACCESS_TYPE.DELETE)
    @Feature(FEATURE_IDENTIFIER.MANAGE_BLOG)
    @Roles(ROLE.SUPER_ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete Blog' })
    async deleteBlog(@Req() req: Request): Promise<any> {
        try {
            return new ResponseDto(true, HttpStatus.OK, [BLOG_CONSTANT.BLOG_DELETED], await this.blogService.deleteBlog(req));
        } catch (err) {
            throw new BadRequestException(BLOG_CONSTANT.CANNOT_DELETE_BLOG, err);
        }
    }

    @Put(':url')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.MANAGE_BLOG)
    @Roles(ROLE.SUPER_ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update Blog' })
    async updateBlog(@Body() blogDto: BlogDto, @Param('url') blogurl: string, @Req() req: Request): Promise<any> {
        try {
            return new ResponseDto(true, HttpStatus.OK, [BLOG_CONSTANT.BLOG_UPDATED], await this.blogService.updateBlog(blogurl, blogDto, req));
        } catch (err) {
            throw new BadRequestException(BLOG_CONSTANT.UPDATE_BLOG_FAILED, err);
        }
    }
}
