import { Schema } from 'mongoose';


export const SuperAdminMigrationSchema = new Schema({
    state: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date
    }
})
