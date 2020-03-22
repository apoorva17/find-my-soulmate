Setup Instructions
===========================

1. Run sudo apt-get update, sudo apt install mongodb npm nodejs
2. Create configuration folder, and create config.js file in it. 
   Content of config.js file:
   `module.exports = {
	  facebook_api_key: FACEBOOK_API_KEY,
	  facebook_api_secret: FACEBOOK_API_SECRET,
	  callback_url: "http://localhost:3000/auth/facebook/callback",
	  personality_insights_api_key: PERSONALITY_INSIGHTS_API_KEY,
	  personality_insights_url: PERSONALITY_INSIGHTS_URL, 
	  use_database: false,
	  host: "localhost",
	  username: "root",
	  password: "",
	  database: ""
	};`
	Fill in the relevent sections in the config file.
3. Run `npm install` to install node modules
4. Run `node app.js` and view web application at `localhost:3000`
