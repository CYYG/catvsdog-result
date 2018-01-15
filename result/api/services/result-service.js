const DbService = require('../services/db-service.js')

exports.getResult = function getResult(connectionString) {
	let result = {cat:0.5,dog:0.5}
	const db = DbService.getDatabase(connectionString)
	return db.any('SELECT * FROM votes')
		.then((resultVote) => {
			const len = resultVote.length
			if(len){
				let cat = 0
				let dog = 0
				for (let i = 0 ;i < len ;i++ ) {
					if(resultVote[i] && resultVote[i].vote === 'a') {
						cat ++
					}	
				}
				result = { cat: cat/len ,dog: (len-cat)/len } 	
			}
			return Promise.resolve(result)
		})
}

