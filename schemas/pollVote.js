
module.exports = function(mongoose) {
  
  var Schema = mongoose.Schema;

  var pollVoteSchema = new Schema({
    poll: String,
    user: String,
    vote: Number
  });
  
  return mongoose.model('pollVote', pollVoteSchema);
}