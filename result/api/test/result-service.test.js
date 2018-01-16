const { expect } = require('chai')
const ResultService = require('../services/result-service.js')
const DbService = require('../services/db-service.js')
const sinon = require('sinon')

describe('result-service', function() {

	let dbServiceMock
	let db
	let dbMock

	beforeEach(function() {
	  	dbServiceMock = sinon.mock(DbService)
	  	db = {
	  		any: function() {
	  			return 'not mocked'
	  		}
  		}
  		dbMock = sinon.mock(db)

		dbServiceMock.expects('getDatabase')
			.once()
			.returns(db)
  	});

  	afterEach(function() {
  		dbServiceMock.restore()
  		dbMock.restore()
  	});

  	it('return a result with cat and dog to 0.5 when no row in the database ',function() {
  		//GIVEN
  	  	dbMock.expects('any')
  			.once()
  			.resolves([])
  		//WHEN
  		return ResultService.getResult()
  			.then((voteResult) => {
	  			//THEN
		  		expect(voteResult).to.deep.equal( {cat:0.5,dog:0.5} )
		  		dbServiceMock.verify()
				dbMock.verify()
  		})
  	})

  	it('return a result with cat = 1 and dog = 0 when there is only one vote for cat',function() {
  		//GIVEN
  		dbMock.expects('any')
  			.once()
  			.withArgs('SELECT * FROM votes')
  			.resolves([ {id_vote:1 ,vote : 'a'} ])

  	  	//WHEN
  		return ResultService.getResult()
  			.then((voteResult) => {
	  			//THEN
			  	expect(voteResult).to.deep.equal( {cat:1,dog:0} )
			  	dbServiceMock.verify()
				dbMock.verify()
  		})
  	})

  	it('return a result with cat = 0 and dog = 1 when there is only one vote for dog',function() {
  		//GIVEN
	  	dbMock.expects('any')
	  		.once()
	  		.withArgs('SELECT * FROM votes')
	  		.resolves([ {id_vote:1 ,vote : 'b'} ])

	  	//WHEN
	  	return ResultService.getResult()
	  		.then((voteResult) => {
		  		//THEN
			  	expect(voteResult).to.deep.equal( {cat:0,dog:1} )
			  	dbServiceMock.verify()
				dbMock.verify()
	  	})
  	})
  	it('return a result with cat = 0.5 and dog = 0.5 when there is only one vote for cat and dog',function() {
  		//GIVEN
	  	dbMock.expects('any')
	  		.once()
	  		.withArgs('SELECT * FROM votes')
	  		.resolves([ 
  				{id_vote:1 ,vote : 'a'},
	  			{id_vote:2 ,vote : 'b'}
	  		])

	  	//WHEN
	  	return ResultService.getResult()
	  		.then((voteResult) => {
		  		//THEN
			  	expect(voteResult).to.deep.equal( {cat:0.5,dog:0.5} )
			  	dbServiceMock.verify()
				dbMock.verify()
	  	})
  	})
  	  	it('return a result with cat = 0.75 and dog = 0.25 when there is only 3 vote for cat and 1 for dog',function() {
  		//GIVEN
	  	dbMock.expects('any')
	  		.once()
	  		.withArgs('SELECT * FROM votes')
	  		.resolves([ 
  				{id_vote:1 ,vote : 'a'},
	  			{id_vote:2 ,vote : 'b'},
	  			{id_vote:3 ,vote : 'a'},
	  			{id_vote:4 ,vote : 'a'},
	  		])

	  	//WHEN
	  	return ResultService.getResult()
	  		.then((voteResult) => {
		  		//THEN
			  	expect(voteResult).to.deep.equal( {cat:0.75 ,dog:0.25} )
			  	dbServiceMock.verify()
				dbMock.verify()
	  	})
  	})
  	  	it('return a result with cat = 1 and dog = 0 when there is 3 vote for cat ',function() {
  		//GIVEN
	  	dbMock.expects('any')
	  		.once()
	  		.withArgs('SELECT * FROM votes')
	  		.resolves([ 
  				{id_vote:1 ,vote : 'a'},
	  			{id_vote:2 ,vote : 'a'},
	  			{id_vote:3 ,vote : 'a'}
	  		])

	  	//WHEN
	  	return ResultService.getResult()
	  		.then((voteResult) => {
		  		//THEN
			  	expect(voteResult).to.deep.equal( {cat:1 ,dog:0} )
			  	dbServiceMock.verify()
				dbMock.verify()
	  	})
	})
 //  	  	 it('close the connection at the end',function() {
 //  		//GIVEN
	//   	dbMock.expects('any')
	//   		.once()
	//   		.withArgs('SELECT * FROM votes')
	//   		.resolves([ 
 //  				{id_vote:1 ,vote : 'a'}
	//   		])

	//   	//WHEN
	//   	return ResultService.getResult()
	//   		.then((voteResult) => {
	// 	  		//THEN )
	// 		  	voteResult.expects("done").once();
	// 		  	dbServiceMock.verify()
	// 			dbMock.verify()
	//   	})
	// })
})

