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
