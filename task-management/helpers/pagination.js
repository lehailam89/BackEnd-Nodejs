module.exports = (objectPagination, query, countRecords) => {
    if(query.page){
        objectPagination.currentPage = parseInt(query.page);
    }

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    objectPagination.totalPage = Math.ceil(countRecords/objectPagination.limitItems);

    return objectPagination;
}