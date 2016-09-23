function dayFilter() {
    return function (day) {
        return {
            Sunday: 'S',
            Monday: 'M',
            Tuesday: 'T',
            Wednesday: 'W',
            Thursday: 'Th',
            Friday: 'F',
            Saturday: 'Su'
        }[day];
    }
}

export default dayFilter;
