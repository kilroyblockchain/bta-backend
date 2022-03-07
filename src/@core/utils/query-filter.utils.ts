export interface IFollowUpFilter {
    $exists?: boolean;
    $lt?: Date;
    $gt?: Date;
    $lte?: Date;
    $gte?: Date;
    $ne?: null;
}
export const getSearchFilter = (query: any, fields: Array<string>) => {
    const searchQuery = {};
    fields.forEach((field) => {
        if (query[field]) {
            searchQuery[field] = query[field];
        }
    });
    return searchQuery;
};

export const getSearchFilterWithRegex = (query: any, fields: Array<string>) => {
    const searchQuery = {};
    fields.forEach((field) => {
        if (query[field]) {
            searchQuery[field] = { $regex: query[field], $options: 'i' };
        }
    });
    return searchQuery;
};

export const getSearchFilterWithRegexAll = (searchValue: any, fields: Array<string>) => {
    if (searchValue) {
        const searchQueryArr = [];
        fields.forEach((field) => {
            const searchObj = {};
            searchObj[field] = { $regex: searchValue, $options: 'i' };
            searchQueryArr.push(searchObj);
        });
        if (searchQueryArr.length) return { $or: searchQueryArr };
    }
    return {};
};

/**
 * Reutrn query used to filter by followupdate as past, present and future
 *
 * @param followUpFilter - type of filter, eg: 'ALL' | 'PAST' | 'TODAY' | 'FUTURE' | 'EMPTY'
 * @param time - client time - new Date(new Date().setHours(0,0,0,0)).getTime()
 * @returns - Query used to filter cases according to followUpDate
 */
export const getFilterDateQuery = (followUpFilter: string, time?: number): IFollowUpFilter => {
    if (followUpFilter) {
        let filter: IFollowUpFilter = {
            $exists: true
        };
        followUpFilter = followUpFilter && followUpFilter !== '' ? followUpFilter.toString().toUpperCase() : 'ALL';
        if (followUpFilter !== 'ALL') {
            const today = new Date(time);
            const tomorrow = new Date(today);

            tomorrow.setDate(tomorrow.getDate() + 1);
            if (followUpFilter === 'PAST') {
                filter = {
                    $exists: true,
                    $lt: today
                };
            } else if (followUpFilter === 'TODAY') {
                filter = {
                    $exists: true,
                    $gte: today,
                    $lt: tomorrow
                };
            } else if (followUpFilter === 'EMPTY') {
                filter = null;
            } else {
                filter = {
                    $exists: true,
                    $gte: tomorrow
                };
            }
        }
        return filter;
    }
};
