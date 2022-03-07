import { Types } from 'mongoose';

export const WorkflowResources = [
    /* 1 */
    {
        _id: new Types.ObjectId('603dde844bb5990dec1f13ac'),
        diseaseId: new Types.ObjectId('602f85071a3c311a4cfc17b1'),
        title: 'Texas COVID-19 Webpage',
        link: 'https://www.dshs.state.tx.us/coronavirus/',
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9')
    },

    /* 2 */
    {
        _id: new Types.ObjectId('603de4fbaba44e27e47762f4'),
        diseaseId: new Types.ObjectId('602f85071a3c311a4cfc17b1'),
        title: 'COVID-19 Symptoms',
        link: 'https://www.dshs.state.tx.us/coronavirus/#symptoms',
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9')
    },

    /* 3 */
    {
        _id: new Types.ObjectId('603de531aba44e27e47762f5'),
        diseaseId: new Types.ObjectId('602f85071a3c311a4cfc17b1'),
        title: 'Symptom Timeline',
        link: '{{CLIENT_URL}}/u/blog/Symptom-Timeline',
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9')
    },

    /* 4 */
    {
        _id: new Types.ObjectId('603de54faba44e27e47762f6'),
        diseaseId: new Types.ObjectId('602f85071a3c311a4cfc17b1'),
        title: 'How COVID-19 Spreads',
        link: '{{CLIENT_URL}}/u/blog/How-COVID-19-Spreads',
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9')
    },

    /* 5 */
    {
        _id: new Types.ObjectId('603de56baba44e27e47762f7'),
        diseaseId: new Types.ObjectId('602f85071a3c311a4cfc17b1'),
        title: 'Example Questions',
        link: '{{CLIENT_URL}}/u/blog/Example-Questions',
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9')
    },

    /* 6 */
    {
        _id: new Types.ObjectId('603de587aba44e27e47762f8'),
        diseaseId: new Types.ObjectId('602f85071a3c311a4cfc17b1'),
        title: 'Active Listening Skills',
        link: '{{CLIENT_URL}}/u/blog/Active-Listening-Skills',
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9')
    }
];
