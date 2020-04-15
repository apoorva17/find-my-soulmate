const fs = require('fs');
const getPersonality = require('./getPersonality');
const app = require('./app');
const MongoClient = require('mongodb').MongoClient;
const mongourl = "mongodb://localhost:27017/";
const dbname = 'FMSdb';
const config = require('./configuration/config');
const collectionName = "users";

const PersonalityInsightsV3 = require('ibm-watson/personality-insights/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const personalityInsights = new PersonalityInsightsV3({
  version: '2017-10-13',
  authenticator: new IamAuthenticator({
    apikey: config.personality_insights_api_key,
  }),
  url: config.personality_insights_url,
});

module.exports = {
	getClosenessAllUser: function(user){
	MongoClient.connect(mongourl, function(err, db){
			if (err) throw err;
			var dbo = db.db(dbname);
			
			dbo.collection(collectionName).distinct("name", function(err,result){
					if (err){
						throw err;
					}else{
						storedata(result);
					}
			});
	});
	
	var userList = [];
	
	function storedata(x){
		userList.push(x);
	};
	
	var personalities = {};
	
	function getMyPersonality(req,res){
		var posts = app.getPosts(req.user);
		
		const profileParams = {
			content: posts,
			contentType: 'text/plain',
			consumptionPreferences: true,
			rawScore: true,
		};
		
		personalityInsights.profile(profileParams)
		.then(profile =>{
				var personalityVec = profile.result;
		})
		.catch(err =>{
				console.log('error:',err);
		});
	};
	
	userList.forEach(function(user){
			personalities[user] = getPersonality.getUser(user);
	}, function(err){
		throw err;
	});
	
	var closeness = {};
	userList.forEach(function(candidate){
			if ((personalities[candidate]['genderpref'] == personalityVec['gender'])
			    && (personalities[candidate]['ageprefmin'] <= personalityVec['age'])
			    && (personalities[candidate]['ageprefmax'] >= personalityVec['age'])){
			closeness[candidate] = getCloseness(personalityVec, personalities[candidate]);
				};
	});
	
	var arr = [];
	for (var candidate in closeness){
		arr.push(closeness[candidate]);
	};
	arr.sort(function(a,b){return b - a});
	
	var top_candidates = arr.slice(0, 3);	
	
	return top_candidates;
	}
};

function getCloseness(v1,v2){
  var norm1 = 0;
  
  for (var key in v1){
    norm1 += v1[key]*v1[key];
    norm1 = Math.sqrt(norm1);
  }
  
  var norm2 = 0;
  
  for (var key in v2){
    norm2 += v2[key]*v2[key];
    norm2 = Math.sqrt(norm2);
  }
  
  var dot = 0;
  
  for (var key in v1){
    if (key in v2){
      dot += v1[key]*v2[key];
    }
  }
    return dot / (norm1*norm2);
};

function getClosenessAllUser(user){
	MongoClient.connect(mongourl, function(err, db){
			if (err) throw err;
			var dbo = db.db(dbname);
			
			dbo.collection(collectionName).distinct("name", function(err, result){
					if (err){
						throw err;
					}else{
						storedata(result);
					}
			});
	});
	
	var userList = [];
	
	function storedata(x){
		userList.push(x);
	};
	
	var personalities = {};
	
	function getMyPersonality(req, res){
		var posts = app.getPosts(req.user);
		
		const profileParams = {
			content: posts,
			contentType: 'text/plain',
			consumptionPreferences: true,
			rawScore: true,
		};
		
		personalityInsights.profile(profileParams)
		.then(profile =>{
				var personalityVec = profile.result;
		})
		.catch(err => {
				console.log('error:',err);
		});
	};
	
	userList.forEach(function(user){
		personalities[user] = getPersonality.getUser(user);
	}, function(err){
		throw err;
	});
	
	var closeness = {};
	userList.forEach(function(candidate){
			if ((personalities[candidate]['genderpref'] == personalityVec['gender'])
				&& (personalities[candidate]['ageprefmin'] <= personalityVec['age'])
				&& (personalities[candidate]['ageprefmax'] >= personalityVec['age'])){
			closeness[candidate] = getCloseness(personalityVec, personalities[candidate]);
				};
	});
	
	var arr = [];
	for (var candidate in closeness){
		arr.push(closeness[candidate]);
	};
	arr.sort(function(a,b){return b - a});
	
	var top_candidates = arr.slice(0, 3);
	
	return top_candidates;
};
