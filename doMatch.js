var fs = require('fs');
var Q = require('q');
var getPersonality = require('./getPersonality');

var personalityToVec = Q.denodeify(getPersonality.personalityToVec);
var getUser = Q.denodeify(getPersonality.getUser);

getCloseness = function(v1,v2){
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

getTop = function(dict, n){
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

getTopDot = function(d1,d2,n){
  var d3 = {};
  for (key in d1){
    if (key in d2){
      d3[key] = d1[key]*d2[key];
    }
  }
  return getTop(d3, n);
}

exports.getClosenessAllUser = function(user,cb){
    var personalityVec;
    
    var UsersList;
    var closeness = {};
    var personalities = {};
  
    var matches = [];
    
    function(personality){
      personalityVec = personalityToVec(personality);
      
      UsersList = JSON.parse(usersText);
      
      var promises = [];
      
      for (user in UsersList){
        promises.push(getUser(user));
      }
      
      return promises;
    }
    
    function(){
      var i = 0;
      for (user in UsersList){
        personalities[user] = personalityToVec(arguments[i]);
        closeness[user]['p'] = {p: getCloseness(personalityVec, personalities[user])};
        i++;
      }
      
      for (user in closeness){
        var el = UsersList[user];
        el['personality'] = getTop(personalities[user], 3);
        
        el['math'] = closeness[user]['p'];
        
        matches.push(el);
      }
      
      cb(null, (matches));
    })
    .catch(function(err){
      cb(err)
    })
    .done();
}
        
