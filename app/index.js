var Extensions, Users, Tasks, Translator;

User = require('./controllers/users');

Task = require('./controllers/tasks');

Translator = require('./shared/translator');

Extensions = function() {
	function Extensions() {
		this._params = {};
		this._translator = new Translator();
		this._operator = null;
		this._channel = null;
		this._help = "Hey, I don't understand!!!. Try help?"
	}

	Extensions.prototype.routeReq = function(channel, user, user_response) {
		this._channel = channel;
		this._params = translator.translate(user_response);
		// check class, then instantiate appropriate
		// switch on operation, all cases transverse basic crud
		if (!this._params.err) {
			this._operator = this._params.controller == "task" ? new Task() : new User();
		}
		switch (this._params.operation) {
			case "create":
				return { status: "in create" : params: this._params }
				return this._operator.create(channel, user, this._params, showServerResponse);
			case "show":
				return { status: "in show" : params: this._params }
				return this._operator.show(channel, user, this._params, showServerResponse);
			case "update":
				return { status: "in update" : params: this._params }
				return this._operator.update(channel, user, this._params, showServerResponse);
			case "delete":
				return { status: "in delete" : params: this._params }
				return this._operator.delete(channel, user, this._params, showServerResponse);
			default:
				return this.showServerResponse(this._help);
		}
	}

	Extensions.prototype.translate = function(response) {
		return this._translator.translate(message);
	}

	Extensions.prototype.showServerResponse(message) {
		this._res.status(200).send(this.message);
		return message
	}
	return Extensions;
}();
module.exports = Extensions;
