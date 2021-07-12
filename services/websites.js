const Account = require('../models/account');
const Website = require('../models/website');
const _ = require('lodash');
const ObjectID = require('mongoose').mongo.ObjectId;

const ctrl = {
  async addWebsite(req, res, next) {
    try {
      const { url, title, accounts } = _.defaults(req.body, {
        url: false,
        title: false,
        accounts: [],
      });
      const createdAcc = [];
      if (!url || !title || _.isEmpty(accounts)) {
        return next({ msg: 'Error: Invalid Parameters' });
      }
      for (let acc of accounts) {
        const { name, username, password } = acc;
        let newAcc = new Account({
          name,
          secrets: {
            username,
            password,
          },
        });
        newAcc = await newAcc.save();
        createdAcc.push(newAcc._id);
      }
      let newWebsite = new Website({
        url,
        title,
        accountIds: createdAcc,
      });
      newWebsite = await newWebsite.save();
      return res.status(200).json({ msg: 'success', data: newWebsite });
    } catch (error) {
      console.error(error);
      next({ msg: 'Error', error });
    }
  },

  async getAll(req, res, next) {
    console.log('>>>>>>>>> CAME!!');
    try {
      const { search } = _.defaults(req.query, {
        search: false,
      });
      let $match = {};

      if (search) {
        $match = {
          $or: [
            { url: { $regex: search, $options: 'i' } },
            { title: { $regex: search, $options: 'i' } },
          ],
        };
      }

      let pipeLine = [];
      if (!_.isEmpty($match)) {
        pipeLine.push({ $match });
      }

      pipeLine = pipeLine.concat([
        {
          $unwind: {
            path: '$accountIds',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'account',
            localField: 'accountIds',
            foreignField: '_id',
            as: 'account',
          },
        },
        {
          $unwind: {
            path: '$account',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$_id',
            url: {
              $first: '$url',
            },
            title: {
              $first: '$title',
            },
            accounts: {
              $push: '$account',
            },
            totalAccounts: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {_id: -1},
        },
      ]);
      const allWebSites = await Website.aggregate(pipeLine);
      return res
        .status(200)
        .json({ data: allWebSites, count: allWebSites.length });
    } catch (error) {
      console.error(error);
      next({ msg: 'Error', error });
    }
  },

  async update(req, res, next) {
    try {
      const websiteId = req.params.id;
      const { url, title } = req.body;
      if (!url || !title || !websiteId) {
        return next({ msg: 'Error: Invalid Parameters' });
      }
      const updatedObj = await Website.findOneAndUpdate(
        {
          _id: websiteId,
        },
        {
          $set: {
            url,
            title,
          },
        },
        { new: true }
      );
      return res.status(200).json({ msg: 'success', data: updatedObj });
    } catch (error) {
      console.error(error);
      next({ msg: 'Error', error });
    }
  },

  async updateAccount(req, res, next) {
    try {
      const { webId, op } = req.params,
        { username, password, name, accId } = _.defaults(req.body, {
          username: null,
          password: null,
          name: null,
          accId: null,
        });

      if (
        !['link', 'unlink'].includes(op) ||
        !webId ||
        (op === 'unlink' && !accId) ||
        (op === 'link' && (!username || !password || !name))
      ) {
        return next({ msg: 'Error: Invalid Parameters' });
      }

      if (op === 'unlink') {
        const updatedObj = await Website.findOneAndUpdate(
          {
            _id: webId,
          },
          {
            $pull: {
              accountIds: accId,
            },
          },
          { new: true }
        );
        return res
          .status(200)
          .json({ msg: 'Removed account', data: updatedObj });
      }

      let newAcc = new Account({
        name,
        secrets: {
          username,
          password,
        },
      });
      newAcc = await newAcc.save();

      const updatedObj = await Website.findOneAndUpdate(
        {
          _id: webId,
        },
        {
          $push: {
            accountIds: newAcc._id,
          },
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ msg: 'Added new account', data: updatedObj });
    } catch (error) {
      console.error(e);
      next({ msg: 'Error', error });
    }
  },

  async delete(req, res, next) {
    try {
      const websiteId = req.params.id;
      if (!websiteId) {
        return next({ msg: 'Error: Invalid Parameters' });
      }
      const result = await Website.findOneAndDelete({
        _id: websiteId,
      });
      return res
        .status(200)
        .json({ msg: 'Successfully deleted', data: result });
    } catch (error) {
      console.error(e);
      next({ msg: 'Error', error });
    }
  },
};

module.exports = ctrl;
