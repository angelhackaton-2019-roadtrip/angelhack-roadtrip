const fs = require('fs');
var express = require('express');
const https = require('https');
const http = require('http');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var Roadtrip = require('./core.js')();
const cors = require('cors');

// Certificate
const privateKey = fs.readFileSync('./cert/privkey.pem', 'utf8');
const certificate = fs.readFileSync('./cert/cert.pem', 'utf8');
const ca = fs.readFileSync('./cert/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

function frontInit() {
    const front = express();
    front.use(morgan('tiny'));
    front.use(express.static('front'));
    return front;
}

function backInit() {
    const back = express();

    back.use(morgan('tiny'));
    back.use(cors());
    // parse application/x-www-form-urlencoded
    back.use(bodyParser.urlencoded({
        extended: false
    }))

    // parse application/json
    back.use(bodyParser.json())

    back.get('/', (req, res) => {
        res.send('Hello, World!');
    });

    back.get('/test', (req, res) => {
        res.send('Hello, World! Test me');
    });

    // POST request with userID / password
    back.post('/auth/login', (req, res) => {
        Roadtrip.account.login(req.body).then(result => {
            delete result._id;
            res.send(result);
        }).catch(error => {
            res.send({
                'error': error.message
            });
        });
    });

    // POST request with userID / name / password / contact / mail / bio / (driver: optional)
    back.post('/account', (req, res) => {
        Roadtrip.account.create(req.body).then(result => {
            if (result.result.ok) {
                res.send({
                    'success': true
                });
            } else {
                res.send({
                    'success': false
                });
            }
        }).catch(error => {
            res.send({
                'error': error.message
            });
        });
    })

    back.get('/accounts/:userID/', (req, res) => {
        Roadtrip.account.find({
            userID: req.params.userID
        }).then(result => {
            delete result._id;
            delete result.password;
            res.send(result);
        }).catch(error => {
            res.send({
                'error': error.message
            });
        });
    });

    back.get('/account/rides', (req, res) => {
        Roadtrip.authkey.whois(req.query.authkey).then(userID => {
            Roadtrip.ride.find().then(allRides => {
                var filtered = [];
                for (ride of allRides) {
                    if (ride.riders.indexOf(userID) != -1) {
                        filtered.push(ride);
                    }
                }
                res.send(filtered);
            }).catch(error => {
                res.send({
                    'error': error.message
                });
            })
        }).catch(error => {
            res.send({
                'error': error.message
            });
        })
    });


    back.post('/ride', (req, res) => {
        Roadtrip.authkey.whois(req.body.authkey).then(userID => {
            delete req.body.authkey;
            req.body.userID = userID;
            req.body.date = new Date(req.body.date);
            if (req.body.tags) {
                req.body.tags = req.body.tags.split(',');
            }
            console.log(req.body);
            Roadtrip.ride.create(req.body).then(result => {
                console.log(result.result);
                if (result.result.ok) {
                    res.send({
                        'success': true,
                        'rideID': result.ops[0].rideID
                    });
                } else {
                    res.send({
                        'success': false
                    });
                }
            }).catch(error => {
                res.send({
                    'error': error.message
                });
            });
        }).catch(error => {
            res.send({
                'error': error.message
            });
        })
    });

    back.get('/rides/:rideID/', (req, res) => {
        Roadtrip.ride.findByID(req.params.rideID).then(result => {
            delete result._id;
            res.send(result);
        }).catch(error => {
            res.send({
                'error': error.message
            });
        })
    });

    back.post('/rides/:rideID/join', (req, res) => {
        Roadtrip.authkey.whois(req.body.authkey).then(userID => {
            Roadtrip.ride.join(req.params.rideID, userID).then(result => {
                if (result.result.ok) {
                    res.send({
                        'success': true
                    });
                } else {
                    res.send({
                        'success': false
                    });
                }
            }).catch(error => {
                res.send({
                    'error': error.message
                });
            })
        }).catch(error => {
            res.send({
                'error': error.message
            });
        })
    })

    back.get('/ride', (req, res) => {
        if (req.query.tags) {
            req.query.tags = req.query.tags.split(',');
        }
        var date = req.query.date
        delete req.query.date;
        Roadtrip.ride.find(req.query).then(result => {
            if (date) {
                var datefilter = [];
                for (k of result) {
                    delete k._id;

                    const _date = new Date(k.date);
                    date = new Date(date);
                    if (_date.getFullYear() == date.getFullYear() && _date.getMonth() == date.getMonth() && _date.getDate() == date.getDate()) {
                        datefilter.push(k);
                    }
                }
                res.send(datefilter);
            } else {
                for (k of result) {
                    delete k._id;
                }
                res.send(result);
            }
        }).catch(error => {
            res.send({
                'error': error.message
            });
        });
    });

    back.get('/ride/all', (req, res) => {
        Roadtrip.ride.find().then(result => {
            delete result._id;
            res.send(result);
        }).catch(error => {
            res.send({
                'error': error.message
            });
        })
    });


    return back;
}


const front = frontInit();
front.use('/api', backInit())

const httpsServer = https.createServer(credentials, front);
httpsServer.listen(8121, () => console.log('Server ready'));