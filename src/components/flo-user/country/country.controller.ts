import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { COUNTRY_CONSTANT } from 'src/@core/constants/api-error-constants';
import { CountryService } from './country.service';
import { Response as FLOResponse } from 'src/@core/response';

@ApiTags('Country state api')
@Controller('country')
export class CountryController {
    constructor(private readonly countryService: CountryService) {}

    @Get('all')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all Countries' })
    async getAllCountry(): Promise<FLOResponse> {
        const allCountries = await this.countryService.findAllCountries();
        return new FLOResponse(true, [COUNTRY_CONSTANT.ALL_COUNTRY_FETCH_SUCCESS]).setSuccessData(allCountries).setStatus(HttpStatus.OK);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get Country Detail' })
    async getCountryByCountryId(@Param('id') id: string): Promise<FLOResponse> {
        const country = await this.countryService.findCountryDetailById(id);
        return new FLOResponse(true, [COUNTRY_CONSTANT.COUNTRY_DETAIL_BY_COUNTRY_CODE_FETCH_SUCCESS]).setSuccessData(country).setStatus(HttpStatus.OK);
    }

    @Get('/states/:countryId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get States By Country Id' })
    async getStatesByCountryId(@Param('countryId') countryId: string): Promise<FLOResponse> {
        const states = await this.countryService.findStatesByCountryId(countryId);
        return new FLOResponse(true, [COUNTRY_CONSTANT.STATES_BY_COUNTRY_CODE_FETCH_SUCCESS]).setSuccessData(states).setStatus(HttpStatus.OK);
    }

    @Get('/state/:stateId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get State Detail By Id' })
    async getStateDetailById(@Param('stateId') stateId: string): Promise<FLOResponse> {
        const state = await this.countryService.findStateById(stateId);
        return new FLOResponse(true, [COUNTRY_CONSTANT.STATE_DETAIL_BY_ID_FETCH_SUCCESS]).setSuccessData(state).setStatus(HttpStatus.OK);
    }
}
