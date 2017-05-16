# spee.ch-backend
javascript backend for spee.ch

## how to use this repository
* install the `lbry` daemon or app
* start your `lbry` daemon or app
* clone this repo 
* run `npm install`
* from your terminal, run `npm start`
	* to run hot, run `nodemon server.js`
* visit [localhost://3000](http://localhost://3000)

## Site Navigation

* spee.ch.
	* To publish a file, navigate to the homepage.
* spee.ch/<the name of the claim>
	* To view the file with the largest bid at a claim.
	* E.g. spee.ch/doitlive.
* spee.ch/< the name of the claim >/< the claim_id >
	* To view a specific file at a claim
	* E.g. spee.ch/doitlive/c496c8c55ed79816fec39e36a78645aa4458edb5
	* E.g. spee.ch/doitlive/c496c8c55ed79816fec39e36a78645aa4458edb5
* spee.ch/<the name of the claim>/all
	* To view a batch of files at a claim
	* E.g. spee.ch/doitlive/all

## development to-do's
* terms of service?
* discover/explore functionality for home page
* display a list of claims at /:name/all
* publish: a temp page while the request is made to the server (with a loading bar?)
* publish: after publishing, take the user to a temp page with the tx info and status of the tx (then redirect when the tx is complete)
* what about the fact that it over-writes uploads of the same name (e.g. sally uses it to upload coconuts pic 1 and fred uses it to upload coconuts pic 2.).  will this cause a problem because spee.ch will be the author for both transactions so fred will override sally?

## API

Note: these are being used for testing durring spee.ch development and may not be maintained

* A GET request to spee.ch/claim_list/<the name of the claim>
	* Will return the claim_list for the claim in json format.
	* E.g. spee.ch/claim_list/doitlive