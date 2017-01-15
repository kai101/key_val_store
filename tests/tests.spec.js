var app = require('./../app.js');
var chai = require('chai');
var request = require('supertest');

var expect = chai.expect;

var key1 = 'abcd!@#$%^&\n';
var val1 = 'abcd!@#$%^&\n';

describe('Basic store and get value test', function() {
	it('should return the value if storing success', function(done) {
		var keyVal = {};
		keyVal[key1] = val1;
		request(app)
			.post('/objects/')
			.send(keyVal)
			.end(function(err, res) {
				expect(res.body).to.be.equal(val1);
				expect(res.statusCode).to.be.equal(200);
				done();
			});
	});
	
	it('should return value', function(done) {
		request(app)
		.get('/objects/'+encodeURIComponent(key1))
		.end(function(err, res) {
			expect(res.body).to.be.equal(val1);
			expect(res.statusCode).to.equal(200);
			done();
		});
	});
});
describe('Time dependent value test', function() {
	var start = Math.floor(Date.now() / 1000),
		endFirst = 0,
		endSecond = 0;
	
	var secondVal = '2ndVal '+val1,
		firstVal = '1stVal '+val1;
	it('should return the 1st value if storing successfully', function(done) {
		this.timeout(300000);
		
		setTimeout(function () {
			var keyVal = {};
			keyVal[key1] = firstVal;
			request(app)
				.post('/objects/')
				.send(keyVal)
				.end(function(err, res) {
					expect(res.body).to.be.equal(firstVal);
					expect(res.statusCode).to.be.equal(200);
					endFirst = Math.floor(Date.now() / 1000);
					done();
				});
		}, 9000);
	});
	
	it('should return the 2nd value if storing successfully', function(done) {
		this.timeout(300000);
		
		setTimeout(function () {
			var keyVal = {};
			keyVal[key1] = secondVal;
			request(app)
				.post('/objects/')
				.send(keyVal)
				.end(function(err, res) {
					expect(res.body).to.be.equal(secondVal);
					expect(res.statusCode).to.be.equal(200);
					endSecond = Math.floor(Date.now() / 1000);
					done();
				});
		}, 9000);
	});
	
	it('should return 2nd value without specify time string', function(done) {
		request(app)
		.get('/objects/'+encodeURIComponent(key1))
		.end(function(err, res) {
			expect(res.body).to.be.equal(secondVal);
			expect(res.statusCode).to.equal(200);
			done();
		});
	});
	
	it('should return 1st value', function(done) {
		request(app)
		.get('/objects/'+encodeURIComponent(key1)+'?timestamp='+endFirst)
		.end(function(err, res) {
			expect(res.body).to.be.equal(firstVal);
			expect(res.statusCode).to.equal(200);
			done();
		});
	});
	
	it('should return 2nd value with 2nd value time string', function(done) {
		request(app)
		.get('/objects/'+encodeURIComponent(key1)+'?timestamp='+endSecond)
		.end(function(err, res) {
			expect(res.body).to.be.equal(secondVal);
			expect(res.statusCode).to.equal(200);
			done();
		});
	});
});

describe('Errors and Overflow test', function() {
	it('should return the value if storing success', function(done) {
		var keyVal = {};
		keyVal[key1.repeat(65536)] = val1.repeat(65536);
		request(app)
			.post('/objects/')
			.send(keyVal)
			.end(function(err, res) {
				//expect(res.body).to.be.equal(val1.repeat(65536));
				expect(res.body.message).to.be.equal('request entity too large');
				expect(res.statusCode).to.be.equal(413);
				done();
			});
	});
	it('should return 404 Key not found', function(done) {
		request(app)
		.get('/objects/'+encodeURIComponent(key1+'123123'))
		.end(function(err, res) {
			expect(res.body.message).to.be.equal('Key not found');
			expect(res.statusCode).to.equal(404);
			done();
		});
	});
	
	it('should return 400 invalid timestamp', function(done) {
		request(app)
		.get('/objects/'+encodeURIComponent(key1)+'?timestamp=123333a')
		.end(function(err, res) {
			expect(res.body.message).to.be.equal('Input errors');
			expect(res.statusCode).to.equal(400);
			done();
		});
	});
});