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
