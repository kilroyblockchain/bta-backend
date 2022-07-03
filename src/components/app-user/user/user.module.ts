import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/components/auth/auth.module';
import { MailModule } from 'src/@utils/mail/mail.module';
import { CountryModule } from '../country/country.module';
import { OrganizationModule } from '../organization/organization.module';
import { SubscriptionTypeModule } from '../subscription-type/subscription-type.module';
import { VerificationModule } from '../verification/verification.module';
import { OrganizationStaffingModule } from '../user-roles/organization-staffing/organization-staffing.module';
import { ChannelDetailModule } from 'src/components/blockchain/channel-detail/channel-detail.module';
import { UserRejectInfoModule } from '../user-reject-info/user-reject-info.module';
import { RefreshTokenSchema } from 'src/components/auth/schemas/refresh-token.schema';
import { BcConnectionModule } from 'src/components/blockchain/bc-connection/bc-connection.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'RefreshToken', schema: RefreshTokenSchema }]),

        AuthModule,
        MailModule,
        CountryModule,
        OrganizationModule,
        SubscriptionTypeModule,
        BcConnectionModule,
        VerificationModule,
        OrganizationStaffingModule,
        ChannelDetailModule,
        UserRejectInfoModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
