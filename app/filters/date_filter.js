function uniqueDateFilter() {
    return function(session) {
        var filterDates = [];
        dates.forEach(function (specificDate) {
            if (filterDates.indexOf(specificDate) == -1) {
                filterDates.push(specificDate);
            }
        });
        return filterDates;
    }
}

export default uniqueDateFilter;
