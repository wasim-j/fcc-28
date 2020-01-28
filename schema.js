const mongoose = require('mongoose');

const schema_comment = new mongoose.Schema({
  comment: {type: String, required: true}
})

const schema_book = new mongoose.Schema ({
  title : {type: String, required: true},
  comments: [schema_comment]
})

schema_book.virtual('commentcount').get(function(){
  return this.comments.length;
})

schema_book.set('toJSON', { virtuals: true });
/*
If you use toJSON() or toObject() mongoose will not include virtuals by default. 
This includes the output of calling JSON.stringify() on a Mongoose document, because JSON.stringify() calls toJSON(). 
Pass { virtuals: true } to either toObject() or toJSON().
*/

module.exports = mongoose.model(process.env.DB_COLLECTION, schema_book);