var fs = require('fs');
var Q = require('q');
var app = require('./app');

var writeFile = Q.denodeify(fs.writeFile);
var readFile = Q.denodeify(fs.readFile);

var getPosts = Q.denodeify(app.getPosts);
var extractMessage = Q.denodeify(app.extractMessage);

// extract user profile data
exports.getUser = function(user, cb){
  var fName = "./example_personality_outputs"+user+".json";
  var personalityG;
  
  readFile(fName)
  .then(function(content){
    cb(null, JSON.parse(content));
  })
  .catch(function(err){
    console.log('personality not catched')
    getPosts(user)
  })
    .then(function(text){
    personalityG = text;
    return writeFile(fName, JSON.stringify(text));
  })
    .then(function(){
    cb(null, personalityG)
  })
  .catch(function(err){cb(err)})
  .done();
}
    
exports.personalityToVec = function(user){
  var raw = user['tree']['raw'];
  var personality = data[0]['children'];
  var needs = data[1]['children'];
  var values = data[2]['children'];
  var behavior = data[3]['children'];
  var consumption_preferences = data[4]['children'];
  
  var vec = {};
  
  function mergeVec(name, percentage){
    if (name in vec)
      vec[name] += percentage;
    else vec[name] = percentage;
  }
  
  for (x of personality){
    mergeVec( x['name'], x['percentile']);
    if ('children' in x){
      for (y of x['children']){
        mergeVec(y['name'], y['percentile']);
        if ('children' in y){
          for (z of y['children']){
            mergeVec(z['name'], z['percentile']);
          }
        }
      }
    }
  }
  
  for (x of needs){
    mergeVec( x['name'], x['percentile']);
    if ('children' in x){
      for (y of x['children']){
        mergeVec(y['name'], y['percentile']);
      }
    }
  }
  
  for (x of values){
    mergeVec( x['name'], x['percentile']);
    if ('children' in x){
      for (y of x['children']){
        mergeVec(y['name'], y['percentile']);
      }
    }
  }
  
  for (x of behavior){
    mergeVec( x['name'], x['percentage']);
    if ('children' in x){
      for (y of x['children']){
        mergeVec(y['name'], y['percentage']);
      }
    }
  }
  
  for (x of consumption_preferences){
    mergeVec( x['name'], x['score']);
    if ('children' in x){
      for (y of x['children']){
        mergeVec(y['name'], y['score']);
      }
    }
  }
  return (vec)
}
