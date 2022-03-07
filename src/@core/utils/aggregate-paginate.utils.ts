import { PaginateResult, Types } from 'mongoose';

export enum FieldType {
    objectId = 'objectId',
    boolean = 'boolean',
    date = 'date'
}

export interface IFields {
    field: string;
    type: string;
}

export interface IOptions {
    page: number;
    limit: number;
}

export interface IFinalResult {
    docs: Array<any>;
    total: number;
    limit: number;
    page: number;
    pages: number;
}

export const getAggregationSearchFilter = (query: any, fields: Array<IFields>): any => {
    const searchQuery = {};
    fields.forEach((field) => {
        if (query[field.field]) {
            if (field.type === FieldType.objectId) searchQuery[field.field] = new Types.ObjectId(query[field.field]);
            if (field.type === FieldType.boolean) searchQuery[field.field] = query[field.field] && query[field.field] === 'true' ? true : false;
        }
    });
    return searchQuery;
};

export const getFinalAggregation = (aggregation: Array<any>, options: IOptions): Array<any> => {
    const facetPipeline = {
        $facet: {
            metadata: [
                { $count: 'total' },
                {
                    $addFields: {
                        page: options.page ? options.page : 1,
                        limit: Number(options.limit) ? Number(options.limit) : 10
                    }
                }
            ],
            data: [{ $skip: (options.page - 1) * options.limit }, { $limit: options.limit }]
        }
    };
    aggregation.push(facetPipeline);
    return aggregation;
};

export const getFinalPaginationResult = (result: Array<any>, options: IOptions): IFinalResult => {
    let finalResult: IFinalResult = {
        docs: [],
        limit: options.limit,
        page: options.page,
        pages: 1,
        total: 0
    };
    const data: Array<any> = result[0].data;
    const paginationData: Array<any> = result[0].metadata;
    if (data.length && paginationData.length)
        finalResult = {
            docs: data,
            total: paginationData[0].total,
            limit: paginationData[0].limit,
            page: paginationData[0].page,
            pages: getTotalPage(paginationData[0].total, paginationData[0].limit)
        };
    return finalResult;
};

const getTotalPage = (total: number, limit: number): number => {
    const divResult = (total / limit).toFixed(1).split('.');
    if (parseInt(divResult[1]) > 0) return parseInt(divResult[0]) + 1;
    return parseInt(divResult[0]);
};

/**
 * Returns aggregate stage to paginate aggregate result
 *
 * @param {number} page - Page Number
 * @param {number} limit - Limit of data in page
 * @returns {Array<any>}  Array of stages to give paginate Result from aggregation in index 0
 */
export const getPaginateDocumentStage = (page: number, limit: number): Array<any> => [
    {
        $facet: {
            metadata: [{ $count: 'total' }, { $addFields: { page: page, limit: limit } }],
            docs: [{ $skip: (page - 1) * limit }, { $limit: limit }]
        }
    },
    {
        $unwind: '$metadata'
    },
    {
        $addFields: {
            total: '$metadata.total',
            page: '$metadata.page',
            limit: '$metadata.limit'
        }
    },
    {
        $project: {
            metadata: 0
        }
    }
];

/**
 * Return builded data with docs, limit and total
 *
 * @param paginateResult - Pagination created by getPaginateDocumentStage function
 * @returns {PaginateResult<T>}  Always return the paginate attributes i.e. docs, limit and total
 */
export const buildPaginateResult = <T>(paginateResult: PaginateResult<T>): PaginateResult<T> => {
    return {
        docs: paginateResult?.docs ?? [],
        page: paginateResult?.page ?? 1,
        limit: paginateResult?.limit ?? 10,
        total: paginateResult?.total ?? 0
    };
};

/**
 * Return Stage to select only projected field from docs
 *
 * @param {string} select - Collection Field to be projected seperated by space
 * @returns {Array<any>}  Project stage of aggregation
 */
export const getProjectStageFromSelect = (select: string): Array<any> => {
    const project = {};
    select.split(' ').forEach((propName: string) => {
        if (propName.startsWith('-')) {
            project[propName.substring(1)] = 0;
        } else {
            project[propName] = 1;
        }
    });
    return select
        ? [
              {
                  $project: project
              }
          ]
        : [];
};

/**
 * Return populate stage to populate field and get only selected fields in documents
 *
 * @param {string} collectionName - Collection to join
 * @param {string} localField - Field from the input documents
 * @param {string} foreignField - Field from the documents of the collection to be joined
 * @returns {Array<any>}  Populate stage and select stage
 */
export const populateField = (collectionName: string, localField: string, foreignField: string): Array<any> => [
    {
        $lookup: {
            from: collectionName,
            localField,
            foreignField,
            as: localField
        }
    },
    {
        $unwind: {
            path: '$' + localField,
            preserveNullAndEmptyArrays: true
        }
    }
];

/**
 * Return populate stage to populate field and get only selected fields in documents
 *
 * @param {string} collectionName - Collection to join
 * @param {string} localField - Field from the input documents
 * @param {string} foreignField - Field from the documents of the collection to be joined
 * @param {string} select - Document Fields to be projected seperated by space
 * @returns {Array<any>}  Populate stage and select stage
 */
export const populateFieldWithSelect = (collectionName: string, localField: string, foreignField: string, select = ''): Array<any> => [
    {
        $lookup: {
            from: collectionName,
            let: { [localField]: '$' + localField },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ['$' + foreignField, '$$' + localField]
                        }
                    }
                },
                ...getProjectStageFromSelect(select)
            ],
            as: localField
        }
    },
    {
        $unwind: {
            path: '$' + localField,
            preserveNullAndEmptyArrays: true
        }
    }
];

/**
 * Return sort stage that sort documents by propertName
 *
 * @param {string} propName - Property name
 * @param {string} type - 'ASC' or 'DESC' -> Default = 'ASC' i.e. 1
 * @returns {Array<any>}  Sort stage
 */
export const sortDocumentsBy = (propName: string, type = 'ASC'): Array<any> => [
    {
        $sort: {
            [propName]: type === 'ASC' ? 1 : -1
        }
    }
];
