import { Types } from 'mongoose';

export const diseases = [
    {
        _id: new Types.ObjectId('602f85071a3c311a4cfc17b1'),
        diseaseName: 'Covid-19',
        contactTracingFor: 14,
        subCategory: [
            {
                _id: new Types.ObjectId('603de6a7aba44e27e47762f9'),
                title: 'Strain',
                values: [
                    {
                        _id: new Types.ObjectId('603de6a7aba44e27e47762fa'),
                        name: 'SARS-COV-2'
                    },
                    {
                        _id: new Types.ObjectId('603de6a7aba44e27e47762fb'),
                        name: 'B117'
                    }
                ]
            }
        ],
        symptoms: [
            {
                _id: new Types.ObjectId('60895385b0068f003fe9e000'),
                title: 'Fever',
                status: true
            },
            {
                _id: new Types.ObjectId('60895385b0068f003fe9e001'),
                title: 'Chills',
                status: true
            },
            {
                _id: new Types.ObjectId('60895385b0068f003fe9e002'),
                title: 'Cough',
                status: true
            },
            {
                _id: new Types.ObjectId('60895385b0068f003fe9e003'),
                title: 'Congestion',
                status: true
            },
            {
                _id: new Types.ObjectId('60895385b0068f003fe9e004'),
                title: 'Breathing Shortness',
                status: true
            },
            {
                _id: new Types.ObjectId('60895385b0068f003fe9e005'),
                title: 'Gastrointestinal Symptoms',
                status: true
            },
            {
                _id: new Types.ObjectId('60895385b0068f003fe9e006'),
                title: 'Headache',
                status: true
            },
            {
                _id: new Types.ObjectId('60895385b0068f003fe9e007'),
                title: 'Muscle Ache',
                status: true
            },
            {
                _id: new Types.ObjectId('60895385b0068f003fe9e008'),
                title: 'Sore Throat',
                status: true
            }
        ],
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9')
    }
];
