var columns = {};

function defaults(Sequelize) {
  columns.id = {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  };
  columns.createdAt = {
    type: Sequelize.DATE
  };
  columns.updatedAt = {
    type: Sequelize.DATE
  };
}

function build_table(Sequelize,listOfColumns) {
  defaults(Sequelize);
  return columns;
}

function column(name,type) {
  columns[name] = {
    type: type
  };
}
module.exports = {
	build_table: build_table,
	column: column,
	defaults: defaults
}