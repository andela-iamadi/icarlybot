var Features, apiCall, Sessions, Registrations;

apiCall = require('./callToAPI');

Sessions = require('./sessions');

Registrations = require('./registrations');

Features = function() {
	function Features(){
		this.sessions = null;
		this.apiCall = null;
		this.registrations = null;
	}
	Features.prototype.setSessions = function(channel, callback) {
		this.sessions = new Sessions(channel, callback);
	}
	Features.prototype.setApiCall = function(url, method, data, callback) {
		this.apiCall = new apiCall(url, method, data, callback);
	}
	Features.prototype.setRegistration = function(channel, user, response){
		this.registrations = new Sessions(channel, user, response);
	}
}();

module.exports = Features;
