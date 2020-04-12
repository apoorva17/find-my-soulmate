var fs = require('fs');
// var Q = require('q');
var app = require('./app');

// extract user profile data
module.exports = {
	getUser: function(user,cb){
		var fName = "./example_personality_outputs"+user+".json";
		var personalityG;
		
		fs.readFile(fName)
		.then(function(content){
				cb(null, JSON.parse(content));
		})
		.catch(function(err){
				console.log('personality not catched');
		})
		.then(function(text){
				personalityG = text;
				return personalityG;
		})
		.catch(function(err){cb(err)})
		.done();
	},
	
	personalityToVec: function(user){
		var userData = getPersonality.getUser(user)
		
		var raw = userData['tree']['raw'];
		var name = raw['name'];
		var gender = raw['gender'];
		var age = raw['age'];
		var genderpref = raw['genderpref'];
		var ageprefmin = raw['ageprefmin'];
		var ageprefmax = raw['ageprefmax'];
		var personality = raw['personality']['children'];
		var needs = raw['needs']['children'];
		var values = raw['values']['children'];
		var behavior = raw['behavior']['children'];
		var consumption_preferences = raw['consumption_preferences']['children'];
  
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
				}
			}
		}
		
		for (x of needs){
			mergeVec( x['name'], x['percentile']);
		}
		
		for (x of values){
			mergeVec( x['name'], x['percentile']);
		}
		
		for (x of behavior){
			mergeVec(x['name'], x['percentage']);
		}
		
		for (x of consumption_preferences){
			if ('consumption_preferences' in x){
				for (y of x['consumption_preferences']){
					mergeVec(y['name'], y['score'])
				}
			}
		}
		return (vec)
	}
};

function getUser(user, cb){
  var fName = "./example_personality_outputs"+user+".json";
  var personalityG;
  
  fs.readFile(fName)
  .then(function(content){
    cb(null, JSON.parse(content));
  })
  .catch(function(err){
    console.log('personality not catched');
  })
    .then(function(text){
    personalityG = text;
    return personalityG;
  })
  .catch(function(err){cb(err)})
  .done();
};
    
function personalityToVec(user){
  var userData = getUser(user)
  
  var raw = userData['tree']['raw'];
  var name = raw['name'];
  var gender = raw['gender'];
  var age = raw['age'];
  var genderpref = raw['genderpref'];
  var ageprefmin = raw['ageprefmin'];
  var ageprefmax = raw['ageprefmax'];
  var personality = raw['personality']['children'];
  var needs = raw['needs']['children'];
  var values = raw['values']['children'];
  var behavior = raw['behavior']['children'];
  var consumption_preferences = raw['consumption_preferences']['children'];
  
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
      }
    }
  }
  
  for (x of needs){
    mergeVec( x['name'], x['percentile']);
  }
  
  for (x of values){
    mergeVec( x['name'], x['percentile']);
  }
  
  for (x of behavior){
    mergeVec( x['name'], x['percentage']);
  }
	
  for (x of consumption_preferences){
    if ('consumption_preferences' in x){
      for (y of x['consumption_preferences']){
	mergeVec(y['name'], y['score'])
      }
    }
  }
  
  return (vec)
};
