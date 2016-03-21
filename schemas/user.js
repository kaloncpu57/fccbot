
module.exports = function(mongoose) {

  var Schema = mongoose.Schema;

  var userSchema = new Schema({
    user: String,
    access: Number
  });

  return mongoose.model('user', userSchema);
}
