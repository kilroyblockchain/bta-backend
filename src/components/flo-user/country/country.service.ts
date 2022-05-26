import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { COUNTRY_CONSTANT } from 'src/@core/constants/api-error-constants';
import { ICountry } from './interfaces/country.interface';
import { IState } from './interfaces/state.interface';

@Injectable()
export class CountryService {
    constructor(@InjectModel('Countries') private readonly CountryModel: Model<ICountry>, @InjectModel('States') private readonly StateModel: Model<IState>) {}

    async findAllCountries(): Promise<ICountry[]> {
        return this.CountryModel.find().select('_id name countryCode phoneCode').exec();
    }

    async findCountryDetailById(id: string): Promise<ICountry | { name: string }> {
        if (!id) return { name: null };
        const country = await this.CountryModel.findById(id).select('_id name');
        return country ? country : { name: null };
    }

    async findStateById(stateId: string): Promise<Partial<IState>> {
        if (!stateId) return { name: null, abbreviation: null };
        const state = await this.StateModel.findById(stateId).select('_id name abbreviation').exec();
        return state ? state : { name: null };
    }

    async findStatesByCountryId(countryId: string): Promise<IState[]> {
        const states = await this.StateModel.find({ countryObjectId: countryId });
        if (!states) {
            throw new BadRequestException(COUNTRY_CONSTANT.FAILED_TO_FETCH_STATES_BY_COUNTRY_CODE);
        }
        return states;
    }

    async findStateInfoByStateAbbreviation(abbr: string): Promise<IState> {
        const state = await this.StateModel.findOne({ abbreviation: abbr });
        return state;
    }
}
