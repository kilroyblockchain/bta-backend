import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogSchema } from './schemas/blog.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Blog', schema: BlogSchema }])],
    controllers: [BlogController],
    providers: [BlogService]
})
export class BlogModule {}
