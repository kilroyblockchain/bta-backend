import { IState } from 'flo-migrations/country-migrate/interfaces/state.interface';
import * as mongoose from 'mongoose';

const State = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId
    },
    idNumber: {
        type: Number
    },
    name: {
        type: String
    },
    abbreviation: {
        type: String
    },
    countryId: {
        type: Number
    },
    countryObjectId: {
        type: mongoose.Schema.Types.ObjectId
    },
    country: {
        type: mongoose.Schema.Types.ObjectId
    }
});

State.index(
    { abbreviation: 1, countryId: 1 },
    {
        unique: true,
        partialFilterExpression: { abbreviation: { $exists: true, $not: '' } }
    }
);

export default mongoose.model<IState>('states', State);
