import * as mongoosePaginate from 'mongoose-paginate';
import { hash } from 'bcrypt';
import * as mongoose from 'mongoose';

mongoose.set('strictPopulate', false);

export const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            minlength: 2,
            maxlength: 40,
            required: true
        },
        lastName: {
            type: String,
            minlength: 2,
            maxlength: 40,
            required: true
        },
        email: {
            type: String,
            minlength: 5,
            maxlength: 255,
            required: true,
            unique: true
        },
        phone: {
            type: String
        },
        country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Countries'
        },
        state: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'States'
        },
        city: {
            type: String
        },
        address: {
            type: String
        },
        zipCode: {
            type: String
        },
        birthDate: {
            type: Date,
            required: false
        },
        company: [
            {
                companyId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Organization',
                    required: true
                },
                staffingId: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Staffing'
                    }
                ],
                deletedStaffingId: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Staffing'
                    }
                ],
                subscriptionType: {
                    type: String,
                    required: true
                },
                userAccept: {
                    type: Boolean,
                    default: true
                },
                default: {
                    type: Boolean,
                    default: true
                },
                verified: {
                    type: Boolean,
                    default: false
                },
                isDeleted: {
                    type: Boolean,
                    default: false
                },
                isRejected: {
                    type: Boolean,
                    default: false
                },
                isAdmin: {
                    type: Boolean,
                    default: false
                },
                userAcceptToken: {
                    type: String,
                    required: false
                }
            }
        ],

        jobTitle: {
            type: String,
            required: false
        },
        password: {
            type: String,
            required: false
        },
        verification: {
            type: String
        },
        verificationExpires: {
            type: Date,
            default: Date.now
        },
        loginAttempts: {
            type: Number,
            default: 0
        },
        blockExpires: {
            type: Date,
            default: Date.now
        },
        resetLink: {
            data: String,
            default: ''
        },
        autoPassword: {
            type: Boolean,
            default: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

UserSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const hashed = await hash(this['password'], 10);
        this['password'] = hashed;
        return next();
    } catch (err) {
        return next(err);
    }
});
UserSchema.plugin(mongoosePaginate);
