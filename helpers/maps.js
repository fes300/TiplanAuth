'use strict'

var async = require('async');

var GoogleMapsAPI = require('./googlemaps/lib');

let publicConfig = {
  key: 'AIzaSyCxa7W9f4riKFzqkTsA5AU5wpBVXj9OWJY',
  stagger_time:       1000, // for elevationPath
  encode_polylines:   false,
  secure:             false // use https
  // proxy:              'http://127.0.0.1:9999' // optional, set a proxy for HTTP requests
};

class  MapsApi {
  constructor(location, type, radius){
    this.params = {location: location, type: type, radius: radius, rankby: null};
    this.gmAPI = new GoogleMapsAPI(publicConfig);
    this._results = null;
    this._errors = null;
    this._next_page_token = null;
  }

  placeSearch(callback){
    this.gmAPI.placeSearch(this.params, (err, response)=> {
      this.results = response.results;
      if(response.next_page_token)
        this.next_page_token = response.next_page_token;

      callback();
    });
  }

  set results(res) {
    console.log('setting results...')
    this._results = res;
  }

  get results() {
    console.log('getting results...')
    return this._results;
  }

  set errors(err) {
    console.log('setting errors...')
    this._results = res;
  }

  get errors() {
    console.log('getting errors...')
    return this._errors;
  }

  set next_page_token(npt){
    this._next_page_token = npt;
  }

  get next_page_token(){
    return this._next_page_token;
  }
}

module.exports = MapsApi;
