import { Document } from 'mongoose';
import { IUser } from 'src/components/flo-user/user/interfaces/user.interface';
import { IParticipant } from 'src/components/participant/interfaces/participant.interface';

export interface IUserMapping extends Document {
    _id: string;
    walletId: string;
    user: IUser;
    participant: IParticipant;
}
