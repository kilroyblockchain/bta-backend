import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FEATURE_IDENTIFIER } from 'src/@core/constants';
import { ICompany, IUser } from 'src/components/flo-user/user/interfaces/user.interface';
import { StaffingInterface } from 'src/components/flo-user/user-roles/organization-staffing/interfaces/organization-staffing.interface';
import { IFeature } from 'src/components/flo-user/features/interfaces/features.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext) {
        const permission = this.reflector.get<string[]>('permission', context.getHandler());
        const feature = this.reflector.get<string[]>('feature', context.getHandler());
        const request = context.switchToHttp().getRequest();
        const user: IUser = request.user;
        if (user && typeof user !== 'boolean' && user.company.find((defCompany) => defCompany.default && (defCompany.subscriptionType === 'training' || defCompany.subscriptionType === 'vaccinated-user'))) {
            if (feature?.includes(FEATURE_IDENTIFIER.PERSONAL_DETAIL)) return true;
        }
        if (user && typeof user !== 'boolean' && user.company.find((defCompany) => defCompany.default && defCompany.isAdmin)) {
            return true;
        }
        if (!permission || !feature) {
            return true;
        }
        const defaultCompany = this.getDefaultCompanyId(user.company);
        const assignedAcceptedAndVerifiedStaffings = this.getAssignedAcceptedAndVerifiedStaffings(user, defaultCompany);
        const filteredStaffs = this.filterStaffByFeature(assignedAcceptedAndVerifiedStaffings as StaffingInterface[], feature);
        const grantedAccessFeatures = this.filterGrantedFeaturesFromStaff(filteredStaffs, feature);
        return this.isFeatureGranted(grantedAccessFeatures, permission);
    }

    getDefaultCompanyId(companyArray: ICompany[]): string {
        return companyArray.find((defCompany) => defCompany.default)?.companyId as string;
    }

    getAssignedAcceptedAndVerifiedStaffings(user: IUser, defaultCompanyId: string) {
        return user.company
            .filter((company) => company.companyId.toString() === defaultCompanyId.toString() && company.userAccept && company.verified)
            .map((company) => company.staffingId)
            .reduce((accumulatedStaffs, currentStaffs) => {
                return [...accumulatedStaffs, ...currentStaffs] as Array<StaffingInterface>;
            });
    }

    filterStaffByFeature(staffs: StaffingInterface[], currentFeature: string[]): StaffingInterface[] {
        return staffs.filter((staff) => {
            let flag = false;
            if (staff?.featureAndAccess?.length) {
                staff?.featureAndAccess?.forEach((featureDetail) => {
                    if (currentFeature?.includes((featureDetail?.featureId as IFeature)?.featureIdentifier)) {
                        flag = true;
                    }
                });
            }
            return flag;
        });
    }

    filterGrantedFeaturesFromStaff(staffs: StaffingInterface[], currentFeature: string[]): IFeature[] {
        const grantedAccessFeatures = [];
        staffs.forEach((staff) => {
            staff?.featureAndAccess?.forEach((userFeature) => {
                if (currentFeature?.includes((userFeature?.featureId as IFeature)?.featureIdentifier)) {
                    grantedAccessFeatures.push(userFeature);
                }
            });
        });
        return grantedAccessFeatures;
    }

    isFeatureGranted(grantedFeatures: IFeature[], grantedPermission: string[]): boolean {
        let grantPermissionFlag: boolean;
        grantedFeatures?.forEach((grantAccess) => {
            grantAccess?.accessType?.forEach((element) => {
                if (grantedPermission?.includes(element)) {
                    grantPermissionFlag = true;
                }
            });
        });
        if (!grantPermissionFlag) {
            throw new ForbiddenException('Forbidden');
        }
        return true;
    }
}
