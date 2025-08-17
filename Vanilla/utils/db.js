const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

module.exports.dbConnection = async () => {
    const uri = process.env.DB_URL;
    if (!uri) throw new Error('Missing DB_URL');

    try {
        await mongoose.connect(uri, {serverSelectionTimeoutMS: 5000})
        await mongoose.connection.db.admin().ping();
        console.log('Mongo connected:', mongoose.connection.host, mongoose.connection.port);
        return mongoose.connection;
    } catch (error) {
        console.log(error.message);
    }
}