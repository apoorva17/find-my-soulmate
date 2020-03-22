var fs = require('fs');
var Q = require('q');

var getPosts = Q.denodeify(app.getPosts);
var extractMessage = Q.denodeify(app.extractMessage);

// extract user profile data
exports.getPersonalityData = function(text, cb) {
