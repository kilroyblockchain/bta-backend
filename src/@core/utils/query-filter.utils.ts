// eslint-disable-next-line @typescript-eslint/ban-types
export const getSearchFilterWithRegexAll = (searchValue: string, fields: Array<string>): Object => {
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
