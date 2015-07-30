var callToAPI;
var https = require('http');
var querystring = require('querystring');

// Now we make our APICall


// var username = 'cent';
// var password = '*****';
// var apiKey = '*****';
// var sessionId = null;

callToAPI = function () {
  function callToAPI(){
    this._url = "";
    this._method = "";
    this._data = "";
    this._dataString = "";
    this._headers = {};
    this._responseString = "";
    this._responseObject = {};
  }

  callToAPI.prototype._host = 'markup-api.herokuapp.com';

  callToAPI.prototype.processRequest = function (url, method, data, callback) {
    this._url = url;
    this._method = method;
    this._data = data;
    this._dataString = JSON.stringify(this._data);
    console.log("Started the api call to: " + this._url);
    try {
      if (this.method == 'GET') {
        if (this._data.length > 0) { this._url += '?' + querystring.stringify(this._data); }
      }
      else {
        this._headers = {
          'Content-Type': 'application/json',
          'Content-Length': this._dataString.length
        };
      }
      console.log(callToAPI.prototype._host + " , data length: " + this._dataString.length );
      this.options = {
        host: callToAPI.prototype._host,
        path: this._url,
        method: this._method,
        headers: this._headers
      };

      console.log("Enter http request");

      req = https.request(this.options, (function(_this) {
        return function (res) {
          console.log("Initiate the http request: " + querystring.stringify(res));
          res.setEncoding('utf-8');
          var buffer = '';
          console.log("Passed res encoding");
          res.on('data', function(chunk) {
            console.log("Receiving data now: " + chunk);
            return buffer += chunk;
          });
          return res.on('end', function() {
            var value;
            console.log("Response directly from server: " + buffer + " of type: " + typeof(buffer));
            value = JSON.parse(buffer);
            if (res.statusCode === 200) {
              console.log("Accessed the server successfully. Received data: " + value);
              return callback(buffer);
            } else {
              return callback({
                'ok': false,
                'error': 'API Response: ' + res.statusCode
              });
            }

          });
        }
      })(this));
      req.write(this._dataString);
      req.end();

    }
    catch(e){
      console.log(e.message);
    }
  }
  return callToAPI;
}();
module.exports = callToAPI;
