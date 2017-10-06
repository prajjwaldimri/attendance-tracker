const mongoose = require('mongoose');
mongoose.promise = global.Promise; // Tells mongoose to use ES6 promises

const artistSchema = new mongoose.Schema({
  discogs_id: { type: Number, unique: true, required: 'There has to be an id' },
  latest_release_id: { type: Number },
  fans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Artist', artistSchema);
