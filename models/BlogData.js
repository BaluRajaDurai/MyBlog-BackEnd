const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema({
  Name:{ type: String, required: true },
  Email:{ type: String, required: true},
  Blogimg:{ type: String},
  Photo:{ type: String, required: true},
  Type:{ type: String, required: true},
  Like:{ type: Number, required: true},
  Dislike:{ type: Number, required: true},
  Title:{ type: String, required: true },
  Description:{ type: String, required: true },
  privateUsers:{type:Array}
});

const blogdata = mongoose.model('blogdata', blogSchema);

module.exports = blogdata;