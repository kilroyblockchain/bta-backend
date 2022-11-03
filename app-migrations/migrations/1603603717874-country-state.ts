import { Country, State } from '../country-migrate/models';
import { countryJSON } from '../country-migrate/data/countries';
import { statesJSON } from '../country-migrate/data/states';
import { IStateJSON } from '../country-migrate/interfaces/state-json.interface';
import { ICountry } from '../country-migrate/interfaces/country.interface';
import { IState } from '../country-migrate/interfaces/state.interface';
import { consoleLogWrapper, dropCollectionIfExist } from 'app-migrations/helper-func';
import { db } from 'app-migrations/migrate';

const { countries } = countryJSON;
const { states } = statesJSON;

async function up(): Promise<void> {
    try {
        const countryCollection = 'countries';
        const stateCollection = 'states';
        await dropCollectionIfExist(db, countryCollection);
        await dropCollectionIfExist(db, stateCollection);

        for (const country of countries) {
            let countryState: IStateJSON[] = [];
            const countryModel = new Country({
                _id: country.oid,
                idNumber: country.id,
                countryCode: country.sortname,
                name: country.name,
                phoneCode: country.phoneCode,
                states: []
            });
            const countryData: ICountry = await countryModel.save();
            countryState = states.filter((state) => state.countryObjectId == country.oid);

            for (const state of countryState) {
                const stateModel = new State({
                    _id: state.oid,
                    idNumber: state.id,
                    name: state.name,
                    abbreviation: state.abbreviation,
                    countryId: state.country_id,
                    countryObjectId: state.countryObjectId
                });
                const stateData: IState = await stateModel.save();
                countryData.states.push(stateData.id);
                await countryData.save();
            }
        }
        consoleLogWrapper('Successfully migrated Country and state data.');
    } catch (err) {
        console.error(err.message);
    }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down(): Promise<void> {
    // Write migration here
}

module.exports = { up, down };
