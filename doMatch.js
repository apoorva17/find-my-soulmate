var fs = require('fs');
var Q = require('q');

var readFile = Q.denodeify(fs.readFile);
var writeFile = Q.denodeify(fs.writeFile);

// extract user profile data
exports.getPersonalityData = function(user) {
  var arr = user._json.posts.data
  if (arr.length > 0){
    return arr
  } else {
    return ""
  }
}
  
