'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

const get_book = require("../get_book");
const Book = require("../schema")

module.exports = app => {

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let all = await Book.find({}, (err, record) => (err) ? false : record);
      (all) ? res.json(all) : res.json([]); 
    })
    
    .post(async (req, res) =>{
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      let book = await get_book(title);
      if(book) return res.json(book);
      
      // else create book
      let new_book = new Book({
        title: title
      })
      let error = new_book.validateSync();
      if(error) return res.send('book title not valid');
    
      book = await new_book.save();
      return res.json(book);
    })
    
    .delete(async (req, res) =>{
      //if successful response will be 'complete delete successful'
      let remove_all = await Book.deleteMany({}, (err, record) => (err) ? false : record)

      if(remove_all) return res.send('complete delete successful'); 
      return res.send('complete delete unsuccessful');
    });

  app.route('/api/books/:id')
    .get(async (req, res) =>{
      let bookid = req.params.id;
      
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if(bookid.length !== 24) return res.send('invalid id');
      let book = await Book.findById(bookid, (err, record) => (err) ? false : record);
      if (book) return res.json(book)
      return res.send('no book exists');
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = {comment: req.body.comment};
      //json res format same as .get
      if(bookid.length !== 24) return res.send('invalid id');
      let book = await Book.findById(bookid, (err, record) => (err) ? false : record);
      if (book) {
        book.comments = book.comments.concat([comment]);
        let error = book.validateSync();
        if(error) return res.send('unable to add comment')
        book = await book.save();
        return res.json(book);
      }
      return res.send('no book exists');
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      if(bookid.length !== 24) return res.send('invalid id');
      let remove = await Book.deleteOne({_id: bookid}, (err, record) => (err) ? false : record)
      if(remove) return res.send('delete successful'); 
      return res.send('delete unsuccessful');
    });
  
};
