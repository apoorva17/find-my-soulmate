REFERENCE
===========================

- Facebook Graph API: https://developers.facebook.com/docs/graph-api/
- Bootstrap Docs: https://getbootstrap.com/docs/4.4/getting-started/introduction/

1. Back-end [Database]
- Support for mysql database added in `app.js`. Change in `app.js` if mysql is not used.
- Refer to `function(accessToken, refreshToken, profile, done)` in `app.js` to add Facebook user information to database. 
-  Add accessToken to database on login and remove from database on logout. Logout occurs in `app.use('/auth/logout'...` in `app.js`.
- Personality analysis results currently posted to `/api/profile/facebook` path. Re-direct results to database. 

2. Front-end 
- Currently, a very simple UI is used for login and account page. Need to enhance it accordingly.
- Bootstrap is being used for front-end currently. 
- UI for matched users required 

3. Matchmaking Algorithm
- Personality analysis results currently posted to `/api/profile/facebook` path. 
- `profileParam` in `app.js` can be updated accordingly depending on result parameters required for algorithm.
