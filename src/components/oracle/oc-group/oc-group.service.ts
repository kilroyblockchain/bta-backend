import { Injectable } from '@nestjs/common';
import { OC_CONNECTION_API } from 'src/@core/constants/bc-constants/oc-connection.api.constant';
import { OCConnectorService } from '../oc-connector/oc-connector.service';
import { OCGroupDto } from './dto/oc-group.dto';
import { OCUserGroupAddDto } from './dto/oc-user-group-add.dto';
import { OCUserGroupDto } from './dto/oc-user-group.dto';

@Injectable()
export class OCGroupService {
    constructor(private readonly ocConnectorService: OCConnectorService) {}

    async getAllGroupList(): Promise<OCGroupDto[]> {
        const ocConnectionResponse = await this.ocConnectorService.get(OC_CONNECTION_API.GROUP_LIST);
        const ocGroupDtoList: OCGroupDto[] = [];
        for (const data of ocConnectionResponse.data) {
            const ocGroupDto = new OCGroupDto();
            ocGroupDto.id = data.id;
            ocGroupDto.displayName = data.displayName;
            ocGroupDtoList.push(ocGroupDto);
        }
        return ocGroupDtoList;
    }

    async addUserToGroup(ocUserGroupAddDto: OCUserGroupAddDto): Promise<void> {
        const ocUserGroupDto = new OCUserGroupDto();
        ocUserGroupDto.groupId = ocUserGroupAddDto.groupId;
        ocUserGroupDto.userName = ocUserGroupAddDto.email;
        await this.ocConnectorService.post(ocUserGroupDto, OC_CONNECTION_API.ADD_USER_TO_GROUP);
    }
}
