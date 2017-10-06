const request = require('request-promise-native');

exports.search = async (req, res) => {
  let response = await request({
    url: `https://api.discogs.com/database/search?q=${req.params
      .artistName}&type=artist`,
    headers: {
      Authorization: `Discogs key=${process.env.DISCOGS_KEY}, secret=${process
        .env.DISCOGS_SECRET}`,
      'User-Agent': 'request'
    }
  });
  res.status(200).json(JSON.parse(response));
};
