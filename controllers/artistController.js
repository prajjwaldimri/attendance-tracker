const mongoose = require('mongoose');
mongoose.promise = global.Promise; // Tells mongoose to use ES6 promises
const Artist = mongoose.model('Artist');
const User = mongoose.model('User');
const request = require('request-promise-native');

// Adds user's selected artist to the database
exports.addArtist = async (req, res) => {
  let artist = await Artist.find({ discogs_id: req.body.artistId });

  if (artist === null) {
    artist = await saveNewArtist(req.body.artistId);
  }

  await Artist.findOneAndUpdate(
    { _id: artist._id },
    { $push: { fans: req.user._id } },
    { new: true, runValidators: true, context: 'query' }
  );

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { fav_artists: artist._id } },
    { new: true, runValidators: true, context: 'query' }
  );

  // Redirects to the previous page
  req.flash('success', 'Artist Added to your favorites!');
  res.status(200);
};

const saveNewArtist = artistId => {
  return new Promise(async (resolve, reject) => {
    // Get the latest release id for the artist from discogs
    let response = JSON.parse(
      await request({
        url: `https://api.discogs.com/artists/${artistId}/releases?sort=year&sort_order=desc&per_page=1`,
        headers: {
          Authorization: `Discogs key=${process.env
            .DISCOGS_KEY}, secret=${process.env.DISCOGS_SECRET}`,
          'User-Agent': 'request'
        }
      })
    );
    // Save the artist to the database and return the saved artist
    Artist.create(
      { discogs_id: artistId, latest_release_id: response.releases[0].id },
      (err, artist) => {
        if (err) {
          reject(err);
        }
        resolve(artist);
      }
    );
  });
};
