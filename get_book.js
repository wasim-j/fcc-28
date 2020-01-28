const Books = require('./schema');

module.exports =  title => {
    return Books.findOne({title}, (err, record) => (err) ? false : record);
}