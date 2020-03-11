const express         =     require('express')
  , passport          =     require('passport')
  , FacebookStrategy  =     require('passport-facebook').Strategy
  , session           =     require('express-session')
  , cookieParser      =     require('cookie-parser')
  , bodyParser        =     require('body-parser')
  , config            =     require('./configuration/config')
  , mysql             =     require('mysql')
  , cfenv             =     require('cfenv')
  , https		  	      =		require('https')
  , db                =    require('./db')
  , app               =     express();


// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the FacebookStrategy within Passport.
passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret:config.facebook_api_secret ,
    callbackURL: config.callback_url,
    profileFields: ['id', 'displayName', 'picture', 'posts']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      if(config.use_database) {
        // // if sets to true
        // pool.query("SELECT * from user_info where user_id="+profile.id, (err,rows) => {
        //   if(err) throw err;
        //   if(rows && rows.length === 0) {
        //       console.log("There is no such user, adding now");
        //       pool.query("INSERT into user_info(user_id,user_name) VALUES('"+profile.id+"','"+profile.username+"')");
        //   } else {
        //       console.log("User already exists in database");
        //   }
        // });
      }
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

  //Unnecessary!! Just to populate db with sample data
  db.init()

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
      profile["name"] = req.user.displayName
      db.insert(profile)

      res.json(profile)
    })
      .catch(err => {
      console.log('error:', err);
    });
});

app.listen(3000);
