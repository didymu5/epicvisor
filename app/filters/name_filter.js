function nameFilter() {
  return function(mentor) {
    return mentor.first_name + " " + mentor.last_name;
  };
}
export default nameFilter;