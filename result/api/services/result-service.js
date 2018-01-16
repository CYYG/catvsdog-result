const DbService = require('../services/db-service.js')

exports.getResult = function getResult(connectionString) {
	const db = DbService.getDatabase(connectionString)
	return db.any('SELECT * FROM votes')
		.then((resultVote) => {
			return _calculateVotePercentage(resultVote)
		})
}

function _calculateVotePercentage(resultVote) {
	let percentageVote = {cat:0.5,dog:0.5}
	const nbVote = resultVote.length
	if(nbVote) {	
		const nbVoteCat = _countNbCatVote(resultVote)
		percentageVote = { cat: nbVoteCat/nbVote ,dog: (nbVote-nbVoteCat)/nbVote }
	}
	return percentageVote
}

function _countNbCatVote(resultVote) {
	let nbVoteCat = 0
	for (let i = 0 ;i < resultVote.length ;i++ ) {
		if(resultVote[i] && resultVote[i].vote === 'a') {
			nbVoteCat ++
		}	
	}
	return nbVoteCat
}
