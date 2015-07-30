var Extensions, apiCall, Sessions, Registrations;

apiCall = require('./callToAPI');

Sessions = require('./sessions');

Registrations = require('./registrations');

Extensions = function() {
	function Extensions() {
		this.sessions = new Sessions();
		this.apiCall = new apiCall();
		this.registrations = new Registrations();
	}

	Extensions.prototype.register = function(channel, user, response, conversation){
		console.log("Getting ext.register");
		return this.registrations.register(channel, user, response, conversation);
	}

	Extensions.prototype.getSessions = function(channel) {
		console.log("Got to ext.getSessions. sessions type: " + typeof this.sessions + ", sess : " + typeof this.sessions._sessionId);
		return this.sessions.showSessions(channel);
	}

	return Extensions;
}();

module.exports = Extensions;
