/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
const Book = require("../schema")

chai.use(chaiHttp);

suite('Functional Tests', () => {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  /*
  test('#example Test GET /api/books', done =>{
     chai.request(server)
      .get('/api/books')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', () => {
    
    let book = null;
    
    before( async () => {
      await Book.deleteMany({}, (err, record) => (err) ? false : record)
    });
    
    after( async () => {
      await Book.deleteMany({}, (err, record) => (err) ? false : record)
    });


    suite('POST /api/books with title => create book object/expect book object', () => {
      
      
      test('Test POST /api/books with title', done => {
        chai.request(server)
          .post('/api/books')
          .send({title: "Book 1"})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title');
            assert.equal(res.body.title, "Book 1");
            book = res.body;
            done();
          })
        
      });
      
      test('Test POST /api/books with no title given', done => {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'book title not valid')
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', () =>{
      
      test('Test GET /api/books',  done =>{
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', () =>{
      
      test('Test GET /api/books/[id] with id not in db',  done =>{
        chai.request(server)
          .get('/api/books/5e3066fea2df747524b3cffd')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists')
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  done =>{
        chai.request(server)
          .get(`/api/books/${book._id}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "commentcount");
            assert.property(res.body, "title");
            assert.property(res.body, "_id");
            assert.equal(res.body.title, "Book 1");
            done();
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', () =>{
      
      test('Test POST /api/books/[id] with comment', done =>{
        chai.request(server)
          .post(`/api/books/${book._id}`)
          .send({comment: "best book ever"})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "commentcount");
            assert.property(res.body, "title");
            assert.property(res.body, "_id");
            assert.equal(res.body.title, "Book 1");
            assert.equal(res.body.comments[0].comment, "best book ever");
            done();
          })
      });
      
    });

  });

});
