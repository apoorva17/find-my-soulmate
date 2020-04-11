
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
	  var dbo = db.db(dbname);
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
	let rawdata = fs.readFileSync('example_personality_outputs/alex.json');
	let data = JSON.parse(rawdata);
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/harry.json');
	data = JSON.parse(rawdata);
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/jane.json');
	data = JSON.parse(rawdata);
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/michael.json');
	data = JSON.parse(rawdata);
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/john.json');
	data = JSON.parse(rawdata);
	insert(data)

	rawdata = fs.readFileSync('example_personality_outputs/tom.json');
	data = JSON.parse(rawdata);
	insert(data)


	rawdata = fs.readFileSync('example_personality_outputs/susan.json');
	data = JSON.parse(rawdata);
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