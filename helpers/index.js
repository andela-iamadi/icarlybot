var Extensions, Users, Tasks, Translator;

User = require('./controllers/users');

Task = require('./controllers/tasks');

Translator = require('./shared/translator');

Extensions = function() {
	function Extensions() {
		this._params = {};
		this._operator = null;
		this._channel = null;
		this._help = "Hey, I don't understand!!!. Try help?"
	}

	Extensions.prototype.routeReq = function(channel, user, user_response, callback) {
		this._channel = channel;
		this._translator = new Translator();
		console.log(this._translator.translate(user_response));
		this._params = this._translator.translate(user_response);
		// check class, then instantiate appropriate
		// switch on operation, all cases transverse basic crud
		if (!this._params.err) {
			this._operator = this._params.controller == "task" ? new Task() : new User();
		}
		switch (this._params.operation) {
			case "create":
				return callback(this._operator.create(channel, user, this._params, this.showServerResponse));
			case "show":
				return callbac(this._operator.show(channel, user, this._params, this.showServerResponse));
			case "update":
				return callback(this._operator.update(channel, user, this._params, this.showServerResponse));
			case "delete":
				return callback(this._operator.delete(channel, user, this._params, this.showServerResponse));
			default:
				return callback(this.showServerResponse(this._help));
		}
	}

	Extensions.prototype.translate = function(response) {
		return this._translator.translate(message);
	}

	Extensions.prototype.showServerResponse = function(channel, message) {
		channel.send(message);
		return message;
	}
	return Extensions;
}();
module.exports = Extensions;
