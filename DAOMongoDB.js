const MongoClient = require('mongodb').MongoClient
var DAOSQL = require('./DAOSQL');
var db;
var coll;


MongoClient.connect('mongodb://0.0.0.0:27017')
    .then((client) => {
        db = client.db("empMongoDB")
        coll = db.collection("empMongoDetails")
        console.log("Collection OK")
    })
    .catch((error) => {
        console.log(error)
        console.log("Collection NOT OK ")
    })

var findAll = function () {
    return new Promise((resolve, reject) => {
        var cursor = coll.find()
        cursor.toArray()
            .then((documents) => {
                console.log("THEN DAO")
                resolve(documents)
            })
            .catch((error) => {
                console.log("CATCH DAO")
                console.log(error)
                reject(error)
            })

    })
}

var addEmployee = function (employee) {
    DAOSQL.getEmployeeforUpdate();
    return new Promise((resolve, reject) => {
        coll.insertOne(employee)
            .then((documents) => {
                resolve(documents)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


module.exports = { findAll, addEmployee }