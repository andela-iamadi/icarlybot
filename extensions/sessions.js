var Sessions, API;
API = require('./callToAPI');

Sessions = function () {
	function Sessions () {
		this._sessionData = "";
		this._sessionId = "";
		this._response = {};
		this._api = null;
	}

	Sessions.prototype.showSessions = function(channel) {
	  this.getSessions(function (data) {

	    if (data != null) {
				console.log("Got back to sessions with data: " + data);
	      data = JSON.parse(data);
	      this._sessionId = "Available sessions are: ";
	      console.log("the data at endpoint: " + data + " with data type: " + typeof(data));

				this._sessionData = "";
	      for (var i = 0; i < data.length; i++) {
	        console.log("name: " + data[i].name + ", session data: " + this._sessionData);
	        this._sessionData += "\r\nSession: " + data[i].name +
	              "\r\nDuration: " + Date.parse(data[i].start_time) + " - " + Date.parse(data[i].end_date);
	      }
	    }
			return channel.send(this._sessionData);
	  });
	};

	Sessions.prototype.getSessions = function(callback) {
		this._api = new API();
	  this._response = this._api.processRequest('/api/v1/sessions', 'GET', {
	    session_id: this._sessionId
	  },
		function(data) {
	    console.log('Fetched ' + data + ' cards');
	    return callback(data);
	  });
	}
	return Sessions;
}();

module.exports = Sessions;
