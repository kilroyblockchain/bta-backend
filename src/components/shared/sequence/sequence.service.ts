/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/components/auth/auth.service';
import { OrganizationService } from 'src/components/flo-user/organization/organization.service';
import { SequenceDto } from './dto/sequence.dto';
import { ISequence } from './interfaces/sequence.interface';

@Injectable()
export class SequenceService {
    constructor(@InjectModel('sequence') private readonly SequenceModel: Model<ISequence>, private readonly organizationService: OrganizationService, private readonly authService: AuthService) {}

    async createUserSequence(createSequenceDto: SequenceDto): Promise<ISequence> {
        const newSequence = new this.SequenceModel(createSequenceDto);
        return await newSequence.save();
    }

    async getNextSequence(id: string, module: string): Promise<ISequence> {
        let seqDetail: ISequence;
        seqDetail = await this.SequenceModel.findOne({ organizationId: id, module });
        if (!seqDetail) {
            const organization = await this.organizationService.findOrganizationById(id);
            const acronym = this.authService.getCompanyAcronym(organization.companyName);
            const orgCode = `${acronym}-${this.getRandomNumber()}`;
            seqDetail = await this.createUserSequence({
                organizationId: id,
                organizationCode: orgCode,
                currentSeq: 1,
                incrementBy: 1,
                module
            });
        }
        await this.updateSequence(seqDetail);
        return seqDetail;
    }

    getRandomNumber(): number {
        return Math.floor(Math.random() * 99);
    }

    async updateSequence(seqObj: ISequence): Promise<ISequence> {
        const { _id, currentSeq, incrementBy } = seqObj;
        await this.SequenceModel.updateOne({ _id }, { currentSeq: currentSeq + incrementBy }, { new: true }).exec();
        return await this.SequenceModel.findById(_id);
    }
}
