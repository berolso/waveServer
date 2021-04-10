const { BadRequestError } = require("../expressError");

// update user data. 
// newData is object of key value pairs
// jsToSql maps js-style data fields to database column names, like { firstName: "first_name", age: "age" }
function sqlForPartialUpdate(newData, jsToSql) {
  const keys = Object.keys(newData);
  if (keys.length === 0) throw new BadRequestError("No data provided ot update user");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(newData),
  };
}

module.exports = { sqlForPartialUpdate };