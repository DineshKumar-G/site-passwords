const mongoose = require('mongoose');
const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    secrets: {
      username: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
  },
  { collection: 'account' }
);
const Account = mongoose.model('Account', accountSchema);
module.exports = Account;
