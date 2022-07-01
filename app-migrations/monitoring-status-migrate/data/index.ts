import { Types } from 'mongoose';

export const monitoringStatus = [
    /* 1 */
    {
        _id: new Types.ObjectId('62be02c496fa72cc27af1001'),
        name: 'Active'
    },
    /* 2 */
    {
        _id: new Types.ObjectId('62be02c496fa72cc27af1002'),
        name: 'App crashed'
    },
    /* 3 */
    {
        _id: new Types.ObjectId('62be02c496fa72cc27af1003'),
        name: 'Request timeout'
    },
    /* 4 */
    {
        _id: new Types.ObjectId('62be02c496fa72cc27af1004'),
        name: 'Connection close without a response'
    },
    /* 5 */
    {
        _id: new Types.ObjectId('62be02c496fa72cc27af1005'),
        name: 'Idle connection'
    },
    /* 6 */
    {
        _id: new Types.ObjectId('62be02c496fa72cc27af1006'),
        name: 'No longer in use'
    },
    /* 7 */
    {
        _id: new Types.ObjectId('62be02c496fa72cc27af1007'),
        name: 'Server request interrupted'
    },
    /* 8 */
    {
        _id: new Types.ObjectId('62be02c496fa72cc27af1008'),
        name: 'Connection limit reached'
    },
    /* 9 */
    {
        _id: new Types.ObjectId('62be02c496fa72cc27af1009'),
        name: 'HTTP restriction'
    },
    /* 10 */
    {
        _id: new Types.ObjectId('62be02c496fa72cc27af1010'),
        name: 'Request Error'
    },
    /* 11 */
    {
        _id: new Types.ObjectId('62be02c496fa72cc27af1011'),
        name: 'Low accuracy due to an imbalanced dataset'
    },
    /* 12 */
    {
        _id: new Types.ObjectId('62be02c496fa72cc27af1012'),
        name: 'Error classification'
    },
    /* 13 */
    {
        _id: new Types.ObjectId('62be02c496fa72cc27af1013'),
        name: 'Bug in system'
    },
    /* 14 */
    {
        _id: new Types.ObjectId('62be02c496fa72cc27af1014'),
        name: 'Overfitting model'
    },
    /* 15 */
    {
        _id: new Types.ObjectId('62be02c496fa72cc27af1015'),
        name: 'Underfitting model'
    },
    /* 15 */
    {
        _id: new Types.ObjectId('62be02c496fa72cc27af1016'),
        name: 'Others'
    }
];
