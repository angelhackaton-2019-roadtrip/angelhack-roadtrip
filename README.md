# Roadtrip

![Roadtrip](https://roadtrip.esinx.net/roadtrip.png)

> Adding experience to carpooling

## Stack

The dependencies follow:

* Backend
	* Node (v8 or above)
		* Express
			* body-parser
			* morgan
			* cors
		* js-sha3
		* mongodb
	* MongoDB (v4 or above)
* Frontend
	* Bootstrap (v4 or above)
	* bootstrap-datepicker([github](https://github.com/uxsolutions/bootstrap-datepicker))
	* jQuery (v3.4.1)
	* Font-awesome


## Note

This is a PoC(Proof-of-Concept) designed for AngelHack Hackathon 2019 @ Seoul. The goal of this project was to provide a basic idea of how *Roadtrip* may function like. 

It provides two major interfaces, one on web and one on android and this repository contains the web experience and the backend that goes along with it.

The secure components(password, hashing, salt, etc) are partially redacted and thus requires some review before using.

## Running

To run the backend(RESTful) and frontend(with ``express.static`` and basic bootstrap), run:
``node route.js``
The other sources are required.
Note that you must initialize the mongo server on port 8120 by default. You are more than welcome to change the ports, just don't mess yourself up by making it more confusing.

## License

THE MIT LICENSE

Copyright 2019 Eunsoo Shin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
