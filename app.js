const express         =     require('express')
  , passport          =     require('passport')
  , FacebookStrategy  =     require('passport-facebook').Strategy
  , session           =     require('express-session')
  , cookieParser      =     require('cookie-parser')
  , bodyParser        =     require('body-parser')
  , config            =     require('./configuration/config')
  , mysql             =     require('mysql')
  , cfenv             =     require('cfenv')
  , https		  	      =		  require('https')
  , db                =     require('./db')
  , app               =     express()
  , fs                =     require('fs')
  , MongoClient       =     require('mongodb').MongoClient
  , mongourl          =     "mongodb://localhost:27017/"
  , dbname            =     "FMSdb"
  , collectionName    =     "users"
  , expressVue        =     require("express-vue")
  , doMatch	          =		  require('./doMatch')
  , getPersonality	  =		  require('./getPersonality');

// Setup express-vue
const path = require('path');
const vueOptions = {
  rootPath: path.join(__dirname, '/views'),
  head: {
    styles: [
      { style: "style/normalize.css" },
      { style: "style/bootstrap.css" }
    ],
  }
};
const expressVueMiddleware = expressVue.init(vueOptions);
app.use(expressVueMiddleware);

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
  const data = { };
  res.renderVue('login.vue', data, vueOptions);
});

app.get('/account', ensureAuthenticated, function(req, res){
  // get len of facebook posts
  var posts = getPosts(req.user)
  var posts_len = posts.split(" ").length

  const data = { 
    user: req.user,
    isLoading: false,
    posts_len: posts_len
  };
  res.renderVue('success.vue', data, vueOptions);
});

app.get('/matches',ensureAuthenticated,function(req, res){
  //Code below returns 3 names from the DB
  doMatch.getClosenessAllUser(req.user).then(result => {
    MongoClient.connect(mongourl, function(err, db){
      if (err) throw err;
      var dbo = db.db(dbname);
      var query = {"name":{$in: result}};
      
      dbo.collection(collectionName).find(query).limit(3).toArray().then(results => {
        if (err) throw err;
        const data = { 
          r: results,
          user: req.user,
          heartBeat: true
        };
        res.renderVue('matches.vue', data, vueOptions);
        db.close();
      })
    })
  })
})

app.get('/auth/facebook', passport.authenticate('facebook',{scope:['email','user_posts']}));

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

function getPosts(user) {
  var arr = user._json.posts.data
  var posts = ""
  for (var i = 0; i < arr.length; i++) {
    posts += extractMessage(arr[i])
  }
  return posts
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
    posts = posts + req.body.selfintro
    
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

        //insert preferences into database
        data["age"] = req.body.age
        data["gender"] = req.body.gender
        data["genderpref"] = req.body.genderpref
        data["ageprefmin"] = req.body.ageprefmin
        data["ageprefmax"] = req.body.ageprefmax
        data["selfintro"] = req.body.selfintro

        db.insert(data)
        
        //redirect to show the matches
        res.redirect('/matches')
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