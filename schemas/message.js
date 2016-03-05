
module.exports = function(mongoose) {
  
  var Schema = mongoose.Schema;

  var messageSchema = new Schema({
    user: String,
    date: { type: Date, default: Date.now() },
    message: { type: String, default: '' }
  });
  
  return mongoose.model('message', messageSchema);
}