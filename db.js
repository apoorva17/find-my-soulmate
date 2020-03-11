
// tools.js
// ========

const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const mongourl = "mongodb://localhost:27017/";

module.exports = {
  //insert json data into db
  insert: function (data) {
  	MongoClient.connect(mongourl, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("FMSdb");
	  dbo.collection("users").insertOne(data, function(err, res) {
	    if (err) throw err;
	    console.log("1 document inserted");
	    db.close();
	  });

	});
  },

  //populate db with sample data
  init: function() {

  	console.log ("resetting the database")
	MongoClient.connect(mongourl, function(err, db) {
		var dbo = db.db("FMSdb");
		dbo.collection("users").deleteMany({})
	});

    console.log ("inserting sample data...")
	let rawdata = fs.readFileSync('example_personality_outputs/oprah.json');
	let data = JSON.parse(rawdata);
	//age, age preference, gender, gender preference?
	data["name"] = "oprah";
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/lebronjames.json');
	data = JSON.parse(rawdata);
	//age, age preference, gender, gender preference?
	data["name"] = "lebronjames";
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/pope.json');
	data = JSON.parse(rawdata);
	//age, age preference, gender, gender preference?
	data["name"] = "pope";
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/trike.json');
	data = JSON.parse(rawdata);
	//age, age preference, gender, gender preference?
	data["name"] = "trike";
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/krungy.json');
	data = JSON.parse(rawdata);
	//age, age preference, gender, gender preference?
	data["name"] = "krungy";
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/faridyu.json');
	data = JSON.parse(rawdata);
	//age, age preference, gender, gender preference?
	data["name"] = "faridyu";
	insert(data)


	rawdata = fs.readFileSync('example_personality_outputs/donfrancisco.json');
	data = JSON.parse(rawdata);
	//age, age preference, gender, gender preference?
	data["name"] = "donfrancisco";
	insert(data)

	 console.log ("done!!")
  }
};


function insert(data) {
  	MongoClient.connect(mongourl, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("FMSdb");
	  dbo.collection("users").insertOne(data, function(err, res) {
	    if (err) throw err;
	    console.log("1 document inserted");
	    db.close();
	  });

	});
    // whatever
  }

function init(){
	MongoClient.connect(mongourl, function(err, db) {
		var dbo = db.db("FMSdb");
		dbo.collection("users").deleteMany({})
	});

	let rawdata = fs.readFileSync('example_personality_outputs/oprah.json');
	let data = JSON.parse(rawdata);
	//age, age preference, gender, gender preference?
	data["name"] = "oprah";
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/lebronjames.json');
	data = JSON.parse(rawdata);
	//age, age preference, gender, gender preference?
	data["name"] = "lebronjames";
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/pope.json');
	data = JSON.parse(rawdata);
	//age, age preference, gender, gender preference?
	data["name"] = "pope";
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/trike.json');
	data = JSON.parse(rawdata);
	//age, age preference, gender, gender preference?
	data["name"] = "trike";
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/krungy.json');
	data = JSON.parse(rawdata);
	//age, age preference, gender, gender preference?
	data["name"] = "krungy";
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/faridyu.json');
	data = JSON.parse(rawdata);
	//age, age preference, gender, gender preference?
	data["name"] = "faridyu";
	insert(data)


	rawdata = fs.readFileSync('example_personality_outputs/donfrancisco.json');
	data = JSON.parse(rawdata);
	//age, age preference, gender, gender preference?
	data["name"] = "donfrancisco";
	insert(data)
}


//query examples
// ==============================
// insertsample();

// //Select all where "needs challenge" perrcentile is > 0.5
// MongoClient.connect(mongourl, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("FMSdb");
//   var query = { "needs": { $elemMatch: { trait_id: "need_challenge", percentile: {$gt: 0.5}} } }

//   dbo.collection("users").find(query).toArray(function(err, results) {
//     if (err) throw err;

//     for (var result of results) {
//     	console.log(result.name)
//     	console.log(result.needs[0].percentile)
//     }
//     db.close();
//   });
// }); 