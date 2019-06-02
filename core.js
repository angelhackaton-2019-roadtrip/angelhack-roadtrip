const RoadtripDB = require('./base.js')();
const sha3_256 = require('js-sha3').sha3_256;

function iterHash(info) {
    var comp = "";
    for (const key of Object.keys(info)) {
        const val = info[key];
        comp += `%${val}%`;
        comp += `%${key}%`;
    }
    return sha3_256(comp);
}

function _authgen(info) {
    var comp = "";
    for (const key of Object.keys(info)) {
        const val = info[key];
        comp += "roadtrip"
        comp += `%${new Date()}%`;
        comp += `%${key}%`;
        comp += `%${sha3_256(val + Math.random())}%`; //  increases entropy
        comp += "auth"
    }
    return sha3_256(comp);
}

function authgen(info) {
    return {
        'userID': info.userID,
        'date': new Date(),
        'authkey': _authgen(info)
    }
}

Object.prototype.hasAllKeys = function (arr) {
    for (key of arr) {
        if (!this.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

function hasAllKeys(obj, arr) {
    for (key of arr) {
        if (!obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}


var Roadtrip = () => {
    var _Roadtrip = this;

    this.account = {};

    this.account.create = (info) => {
        return new Promise((resolve, reject) => {
            if (hasAllKeys(info, ['userID', 'name', 'password', 'contact', 'mail', 'bio'])) {
                if (info.hasOwnProperty('driver') && !info.driver.hasAllKeys(['platenumber', 'vehicle'])) {
                    reject(new Error('Insufficient Information'));
                    return;
                }
                RoadtripDB.account.find({
                    userID: info.userID
                }).then(res => {
                    if (res == null) {
                        info.password = _Roadtrip.account.hasher(info.password);
                        RoadtripDB.account.create(info).then(resolve).catch(reject);
                    } else {
                        reject(new Error('User ID Exists'));
                    }
                }).catch(reject);
            } else {
                reject(new Error('Insufficient Information'));
            }
        });
    }

    this.account.login = (info) => {
        return new Promise((resolve, reject) => {
            if (info.userID && info.password) {
                info.password = _Roadtrip.account.hasher(info.password);
                RoadtripDB.account.find(info).then(res => {
                    const auth = authgen(info);
                    RoadtripDB.authkey.create(auth).then(res => {
                        resolve(auth);
                    }).catch(reject);
                }).catch(reject);
            } else {
                reject(new Error('Insufficient Information'));
            }
        })
    }

    this.account.find = RoadtripDB.account.find;

    this.account.hasher = (info) => {
        var comp = "";
        for (const key of Object.keys(info)) {
            const val = info[key];
            comp += "roadtrip"
            comp += `%${key}%`;
            comp += `%${sha3_256(val)}%`;
            comp += "PLACE_YOUR_OWN_SALT_HERE"
        }
        return sha3_256(comp);
    }

    this.ride = {};

    this.ride.create = (info) => {
        return new Promise((resolve, reject) => {
            console.log(info, hasAllKeys(info, ['userID', 'departure', 'arrival', 'date', 'cost']));
            if (hasAllKeys(info, ['userID', 'departure', 'arrival', 'date', 'cost'])) {
                info.rideID = iterHash(info);
                info.riders = [];
                RoadtripDB.ride.create(info).then(resolve).catch(reject);
            } else {
                reject(new Error('Insufficient Information'));
            }
        })
    }

    this.ride.join = (rideID, userID) => {
        return new Promise((resolve, reject) => {
            RoadtripDB.ride.update({
                'rideID': rideID
            }, {
                $addToSet: {
                    'riders': userID
                }
            }).then(resolve).catch(reject);
        });
    }

    this.ride.find = RoadtripDB.ride.find;
    this.ride.findByID = RoadtripDB.ride.findByID;
    this.ride.update = RoadtripDB.ride.update;

    this.authkey = {};
    this.authkey.whois = (key) => {
        return new Promise((resolve, reject) => {
            RoadtripDB.authkey.find({
                'authkey': key
            }).then(res => {
                if (res != null) {
                    resolve(res.userID);
                } else {
                    reject(new Error('Invalid authkey'));
                }
            }).catch(reject);
        });
    }

    return this;
}

module.exports = Roadtrip;