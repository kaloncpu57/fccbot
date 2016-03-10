
module.exports = function(mongoose) {
  
  var Schema = mongoose.Schema;

  var pollSchema = new Schema({
    creator: String,
    start: { type: Date, default: Date.now() },
    end: { type: Date, default: null },
    title: String,
    options: [String]
  });
  
  return mongoose.model('poll', pollSchema);
}