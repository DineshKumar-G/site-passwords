const mongoose = require('mongoose');
const ObjectID = require('mongoose').mongo.ObjectId;

const websiteSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    accountIds: {
      ref: 'account',
      type: [ObjectID],
      required: true,
    },
  },
  { collection: 'website' }
);
const Website = mongoose.model('Website', websiteSchema);
module.exports = Website;
