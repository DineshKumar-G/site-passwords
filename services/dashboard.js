const Account = require('../models/account');
const Website = require('../models/website');

const ctrl = {
  async getMetrics(req, res, next) {
    try {
      const [totalSites, totalAccounts, [topSite]] = await Promise.all([
        Website.count({}),
        Account.count({}),
        Website.aggregate([
          { $unwind: '$accountIds' },
          {
            $group: {
              _id: '$_id',
              length: { $sum: 1 },
              url: {
                $first: '$url',
              },
              title: {
                $first: '$title',
              },
            },
          },
          { $sort: { length: -1 } },
          { $limit: 1 },
        ]),
      ]);
      return res.status(200).json({ totalSites, totalAccounts, topSite });
    } catch (error) {
      console.error(e);
      next({ msg: 'Error', error });
    }
  },
};

module.exports = ctrl;
