const express         =     require('express')
  , passport          =     require('passport')
  , FacebookStrategy  =     require('passport-facebook').Strategy
  , session           =     require('express-session')
  , cookieParser      =     require('cookie-parser')
  , bodyParser        =     require('body-parser')
  , config            =     require('./configuration/config')
  , mysql             =     require('mysql')
  , cfenv             =     require('cfenv')
  , https	      =	    require('https')
  , db                =     require('./db')
  , app               =     express()
  , doMatch	      =		require('./doMatch')
  , fs                =   	require('fs')
  , MongoClient       = 	require('mongodb').MongoClient
  ,mongourl           = "mongodb://localhost:27017/"
  ,dbname             = "FMSdb"
  ,collectionName     = "users";

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
 
//Deletes and populate data
db.populate()

// Use the FacebookStrategy within Passport.
passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret:config.facebook_api_secret ,
    callbackURL: config.callback_url,
    profileFields: ['id', 'displayName', 'picture.type(large)', 'posts']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      user = 
      { 
        "_id": profile.id,
        "name": profile.displayName,
        "profilepic": profile.photos[0].value,
        "accessToken": accessToken, 
      }
     db.insert(user)
     return done(null, profile);
    });
  }
));

app.use(express.static(__dirname.concat('/public')));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('success', { user: req.user });
});

app.get('/auth/facebook', passport.authenticate('facebook',{scope:['email','user_posts']}));

app.get('/matches',ensureAuthenticated,function(req, res){
	doMatch.getClosenessAllUser(req.user, function(err, results){
		if (err){
			res.json(err);
		}
		else{
			res.render('matches',{r:results});
		}
	}
})
        //Code below returns 3 names from the DB
//        MongoClient.connect(mongourl, function(err, db) { 
//          if (err)  throw err;
//          var dbo = db.db(dbname);
//          var query = { }

//          dbo.collection(collectionName).find(query).limit(3).toArray(function(err, results) {
//            if (err) throw err;
//            var r;
//            res.render('matches', {r:results});
   
//            db.close();
//          }) //db find
//       }); //mongoconnect

// })

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/account', failureRedirect: '/' }));

app.use('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// Personality Insights
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

const PersonalityInsightsV3 = require('ibm-watson/personality-insights/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const personalityInsights = new PersonalityInsightsV3({
  version: '2017-10-13',
  authenticator: new IamAuthenticator({
    apikey: config.personality_insights_api_key,
  }),
  url: config.personality_insights_url,
});

function getPosts(user){
  var arr = user._json.posts.data
  var posts = ""
  for (var i = 0; i < arr.length; i++) {
    posts += extractMessage(arr[i])
  }
  return user
}

function extractMessage(obj) {
  if (obj.hasOwnProperty('message')) {
    return obj['message']
  } else {
    return ""
  }
}

app.post('/api/profile/facebook', ensureAuthenticated, function(req, res){


    var posts = getPosts(req.user) 
    
    const profileParams = {
      content: posts,
      contentType: 'text/plain',
      consumptionPreferences: true,
      rawScores: true,
    };
    

    personalityInsights.profile(profileParams)
      .then(profile => {

        //insert profile into database

        data = profile.result
        data["_id"] = req.user.id

        db.insert(data)

        res.json(profile)
      })
      .catch(err => {
      console.log('error:', err);
    });
});

app.listen(3000);

module.exports = {
	getPosts: function(user){
		var arr = user._json.posts.data
		var posts = ""
		for (var i = 0; i < arr.length; i++) {
			posts += app.extractMessage(arr[i])
		}
		return user
	},
	
	extractMessage: function(obj){
		if (obj.hasOwnProperty('message')) {
			return obj['message']
		} else {
			return ""
		}
	}
};
