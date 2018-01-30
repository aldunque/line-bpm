function connection(mongoose, connectionURL){
	// remove deprecationWarning error
	mongoose.connect(connectionURL, {
		useMongoClient: true
	});
	// get the default connection//localhost
	var db = mongoose.connection;
	// notification error for mongodb errors
	db.on('error', console.error.bind(
	  console,
	  'MongoDB Connection Error'
	));
}

module.exports = connection;