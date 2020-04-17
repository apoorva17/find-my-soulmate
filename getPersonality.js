var fs = require('fs');
var app = require('./app');
const getPersonality = require('./getPersonality');
const MongoClient = require('mongodb').MongoClient;
const mongourl = "mongodb://localhost:27017/";
const dbname = 'FMSdb';
const collectionName = 'users';

// extract user profile data
module.exports = {
	getUser: function(user){
		MongoClient.connect(mongourl, function(err, db){
				if (err) throw err;
				var dbo = db.db(dbname);
				
				dbo.colleciton(collectionName).find({"name":"${user}"}, (err, content) => {
						if (err) throw err;
						var personality = content;
				});
		});
		return personality;
	},
	
	personalityToVec: function(user){
		var raw;
		
		MongoClient.connect(mongourl, function(err, db){
				if (err) throw err;
				var dbo = db.db(dbname);
				dbo.collection(collectionName).find({"name":"${user}"}, (err, content) => {
						if (err) throw err;
						raw = content;
						console.log(raw);
				});
				
				var name = raw['name'];
				// var gender = raw['gender'];
				// var age = raw['age'];
				// var genderpref = raw['genderpref'];
				// var ageprefmin = raw['ageprefmin'];
				// var ageprefmax = raw['ageprefmax'];
				var personality = raw["personality"]['children'];
				var needs = raw['needs'];
				var values = raw['values'];
				var behavior = raw['behavior'];
				var consumption_preferences = raw['consumption_preferences']['consumption_preferences'];
  
				var vec = {};
		
				vec['age'] = age;
				vec['gender'] = gender;
				vec['genderpref'] = genderpref;
				vec['ageprefmin'] = ageprefmin;
				vec['ageprefmax'] = ageprefmax;
	  
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
							mergeVec(y['name'], y['score']);
						}
					}
				}
				return vec;
		});
	}

};

function getUser(user){
	MongoClient.connect(mongourl, function(err, db){
			if (err) throw err;
			var dbo = db.db(dbname);
			
			dbo.collection(collectionName).find({"name":"${user}"}, (err, content) => {
					if (err) throw err;
					var personality = content;
			});
	});
	return personality;
};
    
function personalityToVec(user){
	var raw;
	
	MongoClient.connect(mongourl, function(err, db){
			if (err) throw err;
			var dbo = db.db(dbname);
			dbo.collection(collectionName).find({"name":"${user}"}, (err, content) => {
					if (err) throw err;
					raw = content;
			
			console.log(raw);
			});
			//return raw;
			var name = raw['name'];
		    // var gender = raw['gender'];
		    // var age = raw['age'];
		    // var genderpref = raw['genderpref'];
		    // var ageprefmin = raw['ageprefmin'];
		    // var ageprefmax = raw['ageprefmax'];
		    var personality = raw['personality']['children'];
		    var needs = raw['needs'];
		    var values = raw['values'];
		    var behavior = raw['behavior'];
		    var consumption_preferences = raw['consumption_preferences']['consumption_preferences'];
		  
		    var vec = {};
	
		    vec['age'] = age;
		    vec['gender'] = gender;
		    vec['genderpref'] = genderpref;
		    vec['ageprefmin'] = ageprefmin;
		    vec['ageprefmax'] = ageprefmax;
		    
		    function mergeVec(name, percentage){
		    	if (name in vec)
		    		vec[name] += percentage;
		    	else vec[name] = percentage;
		    };
		    
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
		    			mergeVec(y['name'], y['score']);
		    		}
		    	}
		    }
		    return vec;
	});
}
