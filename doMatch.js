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
				if ((personalityVec["name"] != record["name"])
					&&(personalityVec["ageprefmin"] <= record["age"])
				&&(personalityVec["ageprefmax"] >= record["age"])
				&&(personalityVec["genderpref"] == record["gender"])
				&&(personalityVec["gender"] == record["genderpref"])
				&&(personalityVec["age"] >= record["ageprefmin"])
				&&(personalityVec["age"] <= record["ageprefmax"])){
					var candidate = record["name"];
					personalities[candidate] = getPersonality.personalityToVec(record);
					
					var norm1 = 0;
					var norm2 = 0;
					var dot = 0;
					
					var infoList = ["age","gender","genderpref","ageprefmin","ageprefmax"];
			
					for (var key in personalityVec){
						if (infoList.indexOf(key) === -1){
							norm1 += personalityVec[key]*personalityVec[key];
							norm1 = Math.sqrt(norm1);
						}
					};
			
					for (var key in personalities[candidate]){
						if (infoList.indexOf(key) === -1){
							norm2 += personalities[candidate][key]*personalities[candidate][key];
							norm2 = Math.sqrt(norm2);
						}
					};
				
					for (var key in personalityVec){
						if (key in personalities[candidate]){
							dot += personalityVec[key]*personalities[candidate][key];
						}
					};
			
					closeness[candidate] = dot/(norm1*norm2);
				}
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
			var matches = JSON.stringify(Object.keys(top_candidates));
			var matches = matches.replace(/['"\[\]]/gi,"");
			console.log("your best matches:",matches);
			var matches = matches.split(",");
			return matches;
		}
				
		var myName = user["displayName"];
		return getRecords({"name":myName})
		.then(myInfo => {
				var myInfo = myInfo[0];
				return getPersonality.personalityToVec(myInfo);
		})
		.then(personalityVec => {
			return getRecords({ })
			.then(records => {
					return getCloseness(personalityVec, records);
			})
		})
		.then(closeness => {
			var x = getTop(closeness);
			return x;
		})
		.catch(err => {
				throw err;
		})
	}
}
