import { ICountry } from 'migrations/country-migrate/interfaces/country.interface';
import * as mongoose from 'mongoose';

const Country = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
  },
  idNumber: {
    type: Number,
  },
  name: {
    type: String,
    unique: [true, 'COUNTRY_NAME_IS_NOT_UNIQUE'],
  },
  countryCode: {
    type: String,
    unique: [true, 'COUNTRY_CODE_IS_NOT_UNIQUE'],
  },
  phoneCode: {
    type: Number,
  },
  states: [
    {
      type: mongoose.Types.ObjectId,
    },
  ],
});

export default mongoose.model<ICountry>('countries', Country);
