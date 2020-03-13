
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const mongourl = "mongodb://localhost:27017/";

const dbname = "FMSdb"
const collectionName = "users"

module.exports = {
  //insert json data into db
  insert: function (data) {
  	MongoClient.connect(mongourl, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("FMSdb");
	  dbo.collection(collectionName).updateOne({"_id": data["_id"]}, {$set: data}, {upsert: true}, function(err, res) {
	    if (err) throw err;
	    console.log("1 document inserted / updated");
	    db.close();
	  });

	});
  },

  //populate db with sample data
  populate: function() {

  	console.log ("resetting the database")
	MongoClient.connect(mongourl, function(err, db) {
		var dbo = db.db(dbname);
		dbo.collection("users").deleteMany({})
	});

    console.log ("inserting sample data...")
	let rawdata = fs.readFileSync('example_personality_outputs/oprah.json');
	let data = JSON.parse(rawdata);
	data["_id"] = 1
	data["name"] = "oprah";
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/lebronjames.json');
	data = JSON.parse(rawdata);
	data["_id"] = 2
	data["name"] = "lebronjames";
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/pope.json');
	data = JSON.parse(rawdata);
	data["_id"] = 3
	data["name"] = "pope";
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/trike.json');
	data = JSON.parse(rawdata);
	data["_id"] = 4
	data["name"] = "trike";
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/krungy.json');
	data = JSON.parse(rawdata);
	data["_id"] = 5
	data["name"] = "krungy";
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/faridyu.json');
	data = JSON.parse(rawdata);
	data["_id"] = 6
	data["name"] = "faridyu";
	insert(data)


	rawdata = fs.readFileSync('example_personality_outputs/donfrancisco.json');
	data = JSON.parse(rawdata);
	data["_id"] = 7
	data["name"] = "donfrancisco";
	insert(data)

	 console.log ("done!!")
  }
};


function insert(data) {
  	  MongoClient.connect(mongourl, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("FMSdb");
	  dbo.collection(collectionName).updateOne({"_id": data["_id"]}, {$set: data}, {upsert: true}, function(err, res) {
	    if (err) throw err;
	    console.log("1 document inserted / updated");
	    db.close();
	  });

	});
  }


//query examples
// ==============================
// insertsample();

// //Select all where "needs challenge" perrcentile is > 0.5
// MongoClient.connect(mongourl, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db(dbname);
//   var query = { "needs": { $elemMatch: { trait_id: "need_challenge", percentile: {$gt: 0.5}} } }

//   dbo.collection(collectionName).find(query).toArray(function(err, results) {
//     if (err) throw err;

//     for (var result of results) {
//     	console.log(result.name)
//     	console.log(result.needs[0].percentile)
//     }
//     db.close();
//   });
// }); 