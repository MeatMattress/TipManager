const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');
const {MongoClient} = require('mongodb');
const fs = require('fs');
var cors = require('cors');
const { type } = require('os');
app.use(cors());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.json())
app.get('/', (req, res) => {
    console.log('getting all mongo data');
    const uri = "mongodb+srv://nodeServer:2h3B48m07Lu5UQ1x@mongo-17f300cd.mongo.ondigitalocean.com/tips?authSource=admin&replicaSet=mongo&tls=true&tlsCAFile=./nodeMongoCert.crt"

		try {
			// Connect to the MongoDB cluster
			    MongoClient.connect(uri, function(err, db) {
                if (err) throw err;
                let dbo = db.db("tips");
                // find all data as an array of objects
                dbo.collection("tipsCollection").find().toArray(function(err, result) {
                if (err) throw err;
                // Send the array as the response in json
                res.json(result);
                db.close();
            });
        });
	 
		} catch (e) {
            console.error(e);
            return false;
		} finally {
            console.log("Finished getting all data!");
		}
});

app.post('/', (req, res) => {
	console.log(req.body);
	  data = req.body;
      let insertion = mongoInsert(data);
      if (insertion) {
          res.json({
              success: true
          });
      }
      else {
          res.json({
              success: false
          });
      }
})
// serve the API with signed certificate on 443 (SSL/HTTPS) port
https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/trevornodeserver.club/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/trevornodeserver.club/fullchain.pem'),
}, app).listen(443, () => {
	console.log("Listening on port 443!");
});

async function mongoInsert(data) {
	if (isValidJson(data)) {
        console.log("Inserting ", data);
        // nodeServer user & database = tips
        const uri = "mongodb+srv://nodeServer:2h3B48m07Lu5UQ1x@mongo-17f300cd.mongo.ondigitalocean.com/tips?authSource=admin&replicaSet=mongo&tls=true&tlsCAFile=./nodeMongoCert.crt"
		try {
			// Connect to the MongoDB cluster
			    MongoClient.connect(uri, function(err, db) {
                if (err) throw err;
                let dbo = db.db("tips");
                // insert the data
                dbo.collection("tipsCollection").insertOne(data, function(err, result) {
                    if (err) throw err;
                    console.log("1 doc inserted");
                    console.log(result);
                    db.close();
                    return true;
                });
            });
		} catch (e) {
            console.error(e);
            return false;
		} finally {
			console.log("Finished!")
		}
	}
}
mongoInsert().catch(console.error)


function isValidJson(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}
