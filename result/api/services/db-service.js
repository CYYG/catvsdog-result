const pg = require('pg-promise')()

exports.getDatabase = function getDatabase(connectionString) {
	console.log(`connecting to: ${connectionString} ...`);
	return pg(connectionString)
}