import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { PaginateModel, PaginateResult } from 'mongoose';
import { USER_CONSTANT } from 'src/@core/constants/api-error-constants';
import { IUser } from '../user/interfaces/user.interface';
import { CreateUserRejectInformationDto } from './dto/create-user-reject-info.dto';
import { UpdateUserRejectInformationDto } from './dto/update-user-reject-information.dto';
import { UserRejectInformationResponseDto } from './dto/user-reject-info.dto';
import { IUserRejectInformation } from './interfaces/user-reject-info.interface';

@Injectable()
export class UserRejectInfoService {
    constructor(
        @InjectModel('UserRejectInformation')
        private UserRejectInfoModel: PaginateModel<IUserRejectInformation>
    ) {}

    async createUserRejectInformation(createUserRejectInformationDto: CreateUserRejectInformationDto): Promise<UserRejectInformationResponseDto> {
        const newRejectionInformation = new this.UserRejectInfoModel(createUserRejectInformationDto);
        try {
            const savedUserRejectionInformation = await (
                await newRejectionInformation.save()
            ).populate({
                path: 'rejectedUser rejectedBy',
                select: 'firstName lastName'
            });
            return this.buildUserRejectionInfoResponse(savedUserRejectionInformation);
        } catch (err) {
            throw new BadRequestException(USER_CONSTANT.FAILED_TO_SAVE_REJECTION_INFORMATION);
        }
    }

    async updateUserRejectInformation(rejectInfoId: string, updateUserRejectInfoDto: UpdateUserRejectInformationDto): Promise<UserRejectInformationResponseDto> {
        try {
            const updatedInformation = await this.UserRejectInfoModel.findByIdAndUpdate(
                rejectInfoId,
                {
                    $set: updateUserRejectInfoDto
                },
                { new: true }
            );
            return this.buildUserRejectionInfoResponse(updatedInformation);
        } catch (err) {
            throw new BadRequestException(USER_CONSTANT.FAILED_TO_UPDATE_REJECTION_INFORMATION);
        }
    }

    async getUserRejectionDetail(userId: string, req: Request): Promise<PaginateResult<UserRejectInformationResponseDto> | Array<UserRejectInformationResponseDto>> {
        const { page, limit } = req.query;
        const query = { rejectedUser: userId };

        if (!page || !limit) {
            const rejectionInformations = await this.UserRejectInfoModel.find(query).sort({ updatedAt: -1 }).populate({
                path: 'rejectedUser rejectedBy',
                select: 'firstName lastName'
            });
            return rejectionInformations.map((rejectionInfo) => this.buildUserRejectionInfoResponse(rejectionInfo));
        }
        const options = {
            select: '-updatedAt',
            page: Number(page),
            limit: Number(limit),
            populate: {
                path: 'rejectedUser rejectedBy',
                select: 'firstName lastName'
            },
            sort: { updatedAt: -1 }
        };
        const { docs, ...others } = await this.UserRejectInfoModel.paginate(query, options);
        const newDocs = docs.map((rejectionInfo) => this.buildUserRejectionInfoResponse(rejectionInfo));
        const paginateRejectionInformations = {
            ...others,
            docs: newDocs
        };
        return paginateRejectionInformations;
    }

    buildUserRejectionInfoResponse(userRejectedInfo: IUserRejectInformation): UserRejectInformationResponseDto {
        return {
            id: userRejectedInfo.id,
            rejectedUserDetail: {
                id: (userRejectedInfo.rejectedUser as IUser)._id,
                name: `${(userRejectedInfo.rejectedUser as IUser).firstName} ${(userRejectedInfo.rejectedUser as IUser).lastName}`
            },
            rejectedByUserDetail: {
                id: (userRejectedInfo.rejectedBy as IUser)._id,
                name: `${(userRejectedInfo.rejectedBy as IUser).firstName} ${(userRejectedInfo.rejectedBy as IUser).lastName}`
            },
            rejectionDescription: userRejectedInfo.description,
            blockchainVerified: userRejectedInfo.blockchainVerified,
            createdAt: userRejectedInfo.createdAt
        };
    }
}
