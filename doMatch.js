const fs = require('fs');
// var Q = require('q');
const getPersonality = require('./getPersonality');

// import {personalityToVec} from './getPersonality.js';
// import {getUser} from './getPersonality.js';

module.exports = {
	function getClosenessAllUser(user,cb){
	var userList = {};
	var promises = {};
	var personalities = {};
	var matches = [];
	
	(function(user){
		personalityVec = getPersonality.personalityToVec(user);
		userList += user;
		promises += getUser(user);
		return promises;
	})
	
	(function(){
		var candidate;
		var closeness = {};
		for (candidate of UsersList){
			if ((promises[candidate]['gender'] == promises[user]['genderpref'])
			    && (promises[candidate]['name'] != promises[user])['name'])
			    && (promises[candidate]['age'] <= promises[user]['ageprefmax'])
			    && (promises[candidate]['age'] >= promises[user]['ageprefmin']){
				    personalities[candidate] = getPersonality.personalityToVec(candidate);
				    closeness[candidate] = getCloseness(personalityVec, personalities[candidate]);
			    }
		}
	
	var arr = [];
	for (candidate in closeness){
		arr.push(closeness[candidate]);
	}
	arr.sort(function(a,b){return b - a});
	
	var top_candidates = arr.slice(0, 3);	
	cb(null, (top_candidates));
	})
	.catch(function(err)){
	       cb(err)
	})
	.done();
}
}


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
}

function getTop(dict, n){
  var foo = dict;
  
  var props = Object.keys(foo).map(function(key){
    return{key:key, value:this[key]};
  }, foo);
  props.sort(function(p1,p2) {return p2.value-p1.value;});
  
  var topNObj = props.slice(0,n).reduce(function(obj,prop){
    obj[prop.key] = prop.value;
    return obj;
  }, {});
  
  return topNObj;
}

function getClosenessAllUser(user,cb){
	var userList = {};
	var promises = {};
	var personalities = {};
	var matches = [];
	
	(function(user){
		personalityVec = getPersonality.personalityToVec(user);
		userList += user;
		promises += getUser(user);
		return promises;
	})
	
	(function(){
		var candidate;
		var closeness = {};
		for (candidate of UsersList){
			if ((promises[candidate]['gender'] == promises[user]['genderpref'])
			    && (promises[candidate]['name'] != promises[user])['name'])
			    && (promises[candidate]['age'] <= promises[user]['ageprefmax'])
			    && (promises[candidate]['age'] >= promises[user]['ageprefmin']){
				    personalities[candidate] = getPersonality.personalityToVec(candidate);
				    closeness[candidate] = getCloseness(personalityVec, personalities[candidate]);
			    }
		}
	
	var arr = [];
	for (candidate in closeness){
		arr.push(closeness[candidate]);
	}
	arr.sort(function(a,b){return b - a});
	
	var top_candidates = arr.slice(0, 3);	
	cb(null, (top_candidates));
	})
	.catch(function(err)){
	       cb(err)
	})
	.done();
}
