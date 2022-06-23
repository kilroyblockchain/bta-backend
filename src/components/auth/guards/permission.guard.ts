import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FEATURE_IDENTIFIER } from 'src/@core/constants';
import { ICompany, IUser } from 'src/components/app-user/user/interfaces/user.interface';
import { StaffingInterface } from 'src/components/app-user/user-roles/organization-staffing/interfaces/organization-staffing.interface';
import { IFeature } from 'src/components/app-user/features/interfaces/features.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const logger = new Logger(PermissionGuard.name + '-canActivate');
        try {
            const permission = this.reflector.get<string[]>('permission', context.getHandler());
            const feature = this.reflector.get<string[]>('feature', context.getHandler());
            const request = context.switchToHttp().getRequest();
            const user: IUser = request.user;
            if (user && typeof user !== 'boolean' && user.company.find((defCompany) => defCompany.default)) {
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
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    getDefaultCompanyId(companyArray: ICompany[]): string {
        const logger = new Logger(PermissionGuard.name + '-getDefaultCompanyId');
        try {
            return companyArray.find((defCompany) => defCompany.default)?.companyId as string;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    getAssignedAcceptedAndVerifiedStaffings(user: IUser, defaultCompanyId: string): Array<string | StaffingInterface> {
        const logger = new Logger(PermissionGuard.name + '-getAssignedAcceptedAndVerifiedStaffings');
        try {
            return user.company
                .filter((company) => company.companyId.toString() === defaultCompanyId.toString() && company.userAccept && company.verified)
                .map((company) => company.staffingId)
                .reduce((accumulatedStaffs, currentStaffs) => {
                    return [...accumulatedStaffs, ...currentStaffs] as Array<StaffingInterface>;
                });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    filterStaffByFeature(staffs: StaffingInterface[], currentFeature: string[]): StaffingInterface[] {
        const logger = new Logger(PermissionGuard.name + '-filterStaffByFeature');
        try {
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
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    filterGrantedFeaturesFromStaff(staffs: StaffingInterface[], currentFeature: string[]): IFeature[] {
        const logger = new Logger(PermissionGuard.name + '-filterGrantedFeaturesFromStaff');
        try {
            const grantedAccessFeatures = [];
            staffs.forEach((staff) => {
                staff?.featureAndAccess?.forEach((userFeature) => {
                    if (currentFeature?.includes((userFeature?.featureId as IFeature)?.featureIdentifier)) {
                        grantedAccessFeatures.push(userFeature);
                    }
                });
            });
            return grantedAccessFeatures;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    isFeatureGranted(grantedFeatures: IFeature[], grantedPermission: string[]): boolean {
        const logger = new Logger(PermissionGuard.name + '-isFeatureGranted');
        try {
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
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}
