var apiService;
var https = require('http');
var querystring = require('querystring');

// Now we make our APICall


// var username = 'cent';
// var password = '*****';
// var apiKey = '*****';
// var sessionId = null;

apiService = function () {
  function apiService(){
    this._url = "";
    this._method = "";
    this._data = "";
    this._dataString = "";
    this._headers = {};
    this._responseString = "";
    this._responseObject = {};
  }

  apiService.prototype._host = 'icarly-api.herokuapp.com';

  apiService.prototype.processRequest = function (url, method, data, callback) {
    console.log("Started the api call to: " + this._url);
    this._url = url;
    this._method = method;
    this._data = data;
    this._dataString = JSON.stringify(this._data);
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
      console.log(apiService.prototype._host + " , data length: " + this._dataString.length );
      this.options = {
        host: apiService.prototype._host,
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
            if (res.statusCode === 200) {
              value = JSON.parse(buffer);
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
  return apiService;
}();
module.exports = apiService;
