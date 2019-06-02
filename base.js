const MongoClient = require('mongodb').MongoClient;

var _singleton_db;

function getDB(url, name) {
    return new Promise((resolve, reject) => {
        if (_singleton_db) {
            resolve(_singleton_db);
        } else {
            MongoClient.connect(url, {
                useNewUrlParser: true
            }).then(client => {
                _singleton_db = client.db(name);
                resolve(_singleton_db);
            }).catch(reject);
        }
    })
}

function getRoadtripDB() {
    return getDB("mongodb://localhost:8120/", 'roadtrip');
}

function filterKeys(array, key) {
    var newArr = [];
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        newArr.push(element[key]);
    }
    return newArr;
}


var RoadtripDB = () => {

    var _RoadtripDB = this;

    this.account = {}

    this.account.create = (info) => {
        return new Promise((resolve, reject) => {
            getRoadtripDB().then(db => {
                db.collection('account').insertOne(info).then(resolve).catch(reject);
            }).catch(reject);
        });
    }

    this.account.find = (info) => {
        return new Promise((resolve, reject) => {
            getRoadtripDB().then(db => {
                db.collection('account').findOne(info).then(resolve).catch(reject);
            }).catch(reject);
        })
    }

    this.account.update = (query, modification) => {
        return new Promise((resolve, reject) => {
            getRoadtripDB().then(db => {
                db.collection('account').update(query, modification).then(resolve).catch(reject);
            }).catch(reject);
        })
    }

    this.ride = {}

    this.ride.create = (info) => {
        return new Promise((resolve, reject) => {
            getRoadtripDB().then(db => {
                db.collection('ride').insertOne(info).then(resolve).catch(reject);
            }).catch(reject);
        })
    }

    this.ride.find = (info) => {
        return new Promise((resolve, reject) => {
            getRoadtripDB().then(db => {
                db.collection('ride').find(info, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        res.toArray((err, list) => {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(list);
                            }
                        })
                    }
                });
            }).catch(reject);
        })
    }

    this.ride.findByID = (id) => {
        return new Promise((resolve, reject) => {
            getRoadtripDB().then(db => {
                db.collection('ride').findOne({
                    rideID: id
                }).then(resolve).catch(reject);
            }).catch(reject);
        })
    }

    this.ride.update = (query, modification) => {
        return new Promise((resolve, reject) => {
            getRoadtripDB().then(db => {
                db.collection('ride').update(query, modification).then(resolve).catch(reject);
            }).catch(reject);
        })
    }

    // this.ride.take = (info) => {
    //     return new Promise((resolve, reject) => {
    //         getRoadtripDB().then(db => {

    //         }).catch(reject);
    //     })
    // }

    this.authkey = {}

    this.authkey.create = (info) => {
        return new Promise((resolve, reject) => {
            getRoadtripDB().then(db => {
                db.collection('authkey').insertOne(info).then(resolve).catch(reject);
            }).catch(reject);
        })
    }

    this.authkey.find = (info) => {
        return new Promise((resolve, reject) => {
            getRoadtripDB().then(db => {
                db.collection('authkey').findOne(info).then(resolve).catch(reject);
            }).catch(reject);
        })
    }

    return this;
}

module.exports = RoadtripDB;