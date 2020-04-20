const fs = require('fs');
const getPersonality = require('./getPersonality');
const app = require('./app');
const MongoClient = require('mongodb').MongoClient;
const mongourl = "mongodb://localhost:27017/";
const dbname = 'FMSdb';
const config = require('./configuration/config');
const collectionName = "users";
const db = require("./db");
const doMatch = require("./doMatch");

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
	getClosenessAllUser: async function(user){
		async function getRecords(query){
			try {
				var db = await MongoClient.connect(mongourl);
				var dbo = db.db(dbname);
				records = await dbo.collection(collectionName).find(query).toArray();
				return records
			}catch (err){
				throw err;
			}
		}
		
		function getCloseness(personalityVec, records){
			closeness = {};
			personalities = {};
			
			for (record of records) {
					var candidate = record["name"];
					personalities[candidate] = getPersonality.personalityToVec(record);
					
					var norm1 = 0;
					var norm2 = 0;
					var dot = 0;
			
					for (var key in personalityVec){
						norm1 += personalityVec[key]*personalityVec[key];
						norm1 = Math.sqrt(norm1);
					};
			
					for (var key in personalities[candidate]){
						norm2 += personalities[candidate][key]*personalities[candidate][key];
						norm2 = Math.sqrt(norm2);
					};
				
					for (var key in personalityVec){
						if (key in personalities[candidate]){
							dot += personalityVec[key]*personalities[candidate][key];
						}
					};
			
					closeness[candidate] = dot/(norm1*norm2);
				}
			return closeness;
		}
		
		function getTop(closeness){
			var arr = Object.keys(closeness).map(function (key){
					return {key:key, value:this[key]}
			}, closeness);
			
			arr.sort(function(a,b){return b.value-a.value})
			
			var top_candidates = arr.slice(0,3).reduce(function(obj, candidate){
					obj[candidate.key] = candidate.value;
					return obj},{})
			var matches = Object.keys(top_candidates);
			console.log(matches);
			return matches;
		}
		
		var arr = user._json.posts.data
		var posts = ""
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].hasOwnProperty('message')){
				posts += arr[i]['message']
			}
		}
		
		const profileParams = {
			content: posts,
			contentType: 'text/plain',
			consumptionPreferences: true,
			rawScores: true,
		}
		
		return personalityInsights.profile(profileParams)
		.then(profile => {
				data = profile.result
				data["_id"] = user.id
				data["name"] = user.displayName
				return getPersonality.personalityToVec(data);
		})
		.then(personalityVec => {
			return getRecords({ })
			.then(records => {
					return getCloseness(personalityVec, records);
			})
		})
		.then(closeness => {
			var x = getTop(closeness);
			console.log("closeness" + x);
			return x;
		})
		.catch(err => {
				throw err;
		})

	}
}

