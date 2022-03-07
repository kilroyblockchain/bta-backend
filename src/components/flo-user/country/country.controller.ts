import { Controller, Get, HttpCode, HttpStatus, Param, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { COUNTRY_CONSTANT } from 'src/@core/constants/api-error-constants';
import { CountryService } from './country.service';
import { Response } from './dto/response';

@ApiTags('Country state api')
@Controller('country')
export class CountryController {
    constructor(private readonly countryService: CountryService) {}

    @Get('all')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all Countries' })
    async getAllCountry(): Promise<any> {
        try {
            return new Response(true, HttpStatus.OK, [COUNTRY_CONSTANT.ALL_COUNTRY_FETCH_SUCCESS], await this.countryService.findAllCountries());
        } catch (err) {
            throw new NotFoundException(COUNTRY_CONSTANT.FAILED_TO_FETCH_ALL_COUNTRY, err);
        }
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get Country Detail' })
    async getCountryByCountryId(@Param('id') id: string): Promise<any> {
        try {
            return new Response(true, HttpStatus.OK, [COUNTRY_CONSTANT.COUNTRY_DETAIL_BY_COUNTRY_CODE_FETCH_SUCCESS], await this.countryService.findCountryDetailById(id));
        } catch (err) {
            throw new NotFoundException(COUNTRY_CONSTANT.FAILED_TO_FETCH_COUNTRY_DETAIL_BY_COUNTRY_CODE, err);
        }
    }

    @Get('/states/:countryId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get States By Country Id' })
    async getStatesByCountryId(@Param('countryId') countryId: string): Promise<any> {
        try {
            return new Response(true, HttpStatus.OK, [COUNTRY_CONSTANT.STATES_BY_COUNTRY_CODE_FETCH_SUCCESS], await this.countryService.findStatesByCountryId(countryId));
        } catch (err) {
            throw new NotFoundException(COUNTRY_CONSTANT.FAILED_TO_FETCH_STATES_BY_COUNTRY_CODE, err);
        }
    }

    @Get('/state/:stateId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get State Detail By Id' })
    async getStateDetailById(@Param('stateId') stateId: string): Promise<any> {
        try {
            return new Response(true, HttpStatus.OK, [COUNTRY_CONSTANT.STATE_DETAIL_BY_ID_FETCH_SUCCESS], await this.countryService.findStateById(stateId));
        } catch (err) {
            throw new NotFoundException(COUNTRY_CONSTANT.FAILED_TO_FETCH_STATE_DETAIL_BY_ID, err);
        }
    }
}
