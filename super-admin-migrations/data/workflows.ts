import { Types } from 'mongoose';

export const Workflows = [
    /* Contact tracing */
    /* 1 */
    {
        _id: new Types.ObjectId('603dec6eaba44e27e47762fc'),
        diseaseId: [new Types.ObjectId('602f85071a3c311a4cfc17b1')],
        workflowName: 'Greeting',
        position: 1,
        workFlowFor: 'contact-tracing',
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9'),
        isDeleted: false
    },

    /* 2 */
    {
        _id: new Types.ObjectId('603dec75aba44e27e47762fd'),
        diseaseId: [new Types.ObjectId('602f85071a3c311a4cfc17b1')],
        workflowName: 'Verification',
        position: 2,
        workFlowFor: 'contact-tracing',
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9'),
        isDeleted: false
    },

    /* 3 */
    {
        _id: new Types.ObjectId('603dec7caba44e27e47762fe'),
        diseaseId: [new Types.ObjectId('602f85071a3c311a4cfc17b1')],
        workflowName: 'Identify Contacts',
        position: 3,
        workFlowFor: 'contact-tracing',
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9'),
        isDeleted: false
    },

    /* 4 */
    {
        _id: new Types.ObjectId('603dec83aba44e27e47762ff'),
        diseaseId: [new Types.ObjectId('602f85071a3c311a4cfc17b1')],
        workflowName: 'Isolation/Quarantine Resources',
        position: 4,
        workFlowFor: 'contact-tracing',
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9'),
        isDeleted: false
    },

    /* Vaccine outreach */
    /* 1 */
    {
        _id: new Types.ObjectId('603dec6eaba44e27e47762a1'),
        diseaseId: [new Types.ObjectId('602f85071a3c311a4cfc17b1')],
        workflowName: 'Greeting and identification',
        position: 1,
        workFlowFor: 'vaccine-outreach',
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9'),
        isDeleted: false
    },

    /* 2 */
    {
        _id: new Types.ObjectId('603dec75aba44e27e47762a2'),
        diseaseId: [new Types.ObjectId('602f85071a3c311a4cfc17b1')],
        workflowName: 'Vaccine information',
        position: 2,
        workFlowFor: 'vaccine-outreach',
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9'),
        isDeleted: false
    },

    /* 3 */
    {
        _id: new Types.ObjectId('603dec7caba44e27e47762a3'),
        diseaseId: [new Types.ObjectId('602f85071a3c311a4cfc17b1')],
        workflowName: 'Vaccine appointment assistance',
        position: 3,
        workFlowFor: 'vaccine-outreach',
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9'),
        isDeleted: false
    }
];
