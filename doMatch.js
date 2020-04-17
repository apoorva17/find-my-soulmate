const fs = require('fs');
const getPersonality = require('./getPersonality');
const app = require('./app');
const MongoClient = require('mongodb').MongoClient;
const mongourl = "mongodb://localhost:27017/";
const dbname = 'FMSdb';
const config = require('./configuration/config');
const collectionName = "users";
const db = require("./db");

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
		var arr = user._json.posts.data;
		var posts = "";
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].hasOwnProperty('message')){
				posts += arr[i]['message'];
			};
		};
		
		const profileParams = {
			content: posts,
			contentType: 'text/plain',
			consumptionPreferences: true,
			rawScores: true,
		};
    
		personalityInsights.profile(profileParams)
		.then(profile => {
				db.insert(profile.result);
		})
		.catch(err =>{
				console.log('error:',err);
		});
		
		var userList;
		MongoClient.connect(mongourl, function(err, db){
				if (err) throw err;
				var dbo = db.db(dbname);
				
				dbo.collection(collectionName, function(err, collection){
						collection.distinct("name", function(err, results){
								if (err) throw err;
								userList = results;
								console.log(userList);
								return userList;
						
						var personalityVec = getPersonality.personalityToVec(user);
						console.log("personalityVec:",personalityVec);
						
						var personalities = {};
						
						userList.forEach(function(user){
								personalities[user] = getPersonality.personalityToVec(user);
						}, function(err){
							throw err;
						});
						
						var closeness = {};
						userList.forEach(function(candidate){
								closeness[candidate]["name"] = candidate.toString();
								closeness[candidate]["score"] = getCloseness(personalityVec, personalities[candidate]);
				//if ((personalities[candidate]['genderpref'] == personalityVec['gender'])
				//    && (personalities[candidate]['ageprefmin'] <= personalityVec['age'])
				//    && (personalities[candidate]['ageprefmax'] >= personalityVec['age'])){
						});
						
						var arr = Object.keys(closeness).map(function (key){
								return {key:key, value:this[key]};
						}, closeness);
						
						arr.sort(function(a,b){
								return b.value-a.value;
						});
						
						var top_candidates = arr.slice(0,3).reduce(function(obj, candidate){
								obj[candidate.key] = candidate.value;
								return obj;
						}, {});
						return top_candidates;
				});
		});
		});
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
	var arr = user._json.posts.data;
	var posts = "";
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].hasOwnProperty('message')){
			posts += arr[i]['message'];
		};
	};
	
	const profileParams = {
      content: posts,
      contentType: 'text/plain',
      consumptionPreferences: true,
      rawScores: true,
    };
    
    personalityInsights.profile(profileParams)
    .then(profile => {
    		db.insert(profile.result);
    })
    .catch(err =>{
    		console.log('error:',err);
    });
    
    var userList;
	MongoClient.connect(mongourl, function(err, db){
			if (err) throw err;
			var dbo = db.db(dbname);
			
			db(dbname).collection(collectionName, function(err, collection){
					collection.distinct("name", function(err, results){
							if (err) throw err;
							userList = results;
							console.log(userList);
							return userList;
					
					
					var personalityVec = getPersonality.personalityToVec(user);
					console.log("personalityVec:",personalityVec);
    
					var personalities = {};
	
					userList.forEach(function(user){
							personalities[user] = getPersonality.personalityToVec(user);
					}, function(err){
						throw err;
					});
					
					var closeness = {};
					userList.forEach(function(candidate){
							closeness[candidate]["name"] = candidate.toString();
							closeness[candidate]["score"] = getCloseness(personalityVec, personalities[candidate]);
			//if ((personalities[candidate]['genderpref'] == personalityVec['gender'])
			//	&& (personalities[candidate]['ageprefmin'] <= personalityVec['age'])
			//	&& (personalities[candidate]['ageprefmax'] >= personalityVec['age'])){
					});
					
					var arr = Object.keys(closeness).map(function (key){
							return {key:key, value:this[key]};
					}, closeness);
					
					arr.sort(function(a,b){
							return b.value-a.value;
					});
					
					var top_candidates = arr.slice(0,3).reduce(function(obj, candidate){
							obj[candidate.key] = candidate.value;
							return obj;
					}, {});
					
					//var arr = [];
					//for (var candidate in closeness){
					//	arr.push(closeness[candidate]);
					//};
					//arr.sort(function(a,b){return b - a});
					
					//var top_candidates = arr.slice(0, 3);
					//console.log("top_candidates:",top_candidates);
					return top_candidates;
					});
			});
	});
}
