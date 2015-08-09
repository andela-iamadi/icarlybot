var Extensions, Users, Tasks, Translator;

User = require('./controllers/users');

Task = require('./controllers/tasks');

Translator = require('./shared/translator');

Extensions = function() {
	function Extensions() {
		this._params = {};
		this._operator = null;
		this._translator = null;
		this._channel = null;
		this._help = "Hey, I don't understand!!!. Try help?"
	}

	Extensions.prototype.routeReq = function(channel, user, user_response, callback) {
		this._channel = channel;
		this._translator = new Translator();
		this._params = this._translator.translate(user_response);
		// this._params = { this._params["controller"] : this._params };
		var control = this._params["controller"];
		this._params = { control : this._params };
		console.log("Params request gotten: " + this._params);
		// check class, then instantiate appropriate
		// switch on operation, all cases transverse basic crud
		if (!this._params.hasOwnProperty('ok')) {
			this._operator = this._params["controller"] == "task" ? new Task() : new User();

			switch (this._params.operation) {
				case "create":
					return callback(this._operator.create(this._params, callback));
				case "show":
					return this._operator.show(this._params, callback);
				case "update":
					return this._operator.update(this._params, callback);
				case "delete":
					return this._operator.delete(this._params, callback);
				default:
					return this.showServerResponse(this._help);
			}
		}
	}

	Extensions.prototype.translate = function(response) {
		return this._translator.translate(message);
	}

	Extensions.prototype.showServerResponse = function(channel, message) {
		if (!message.hasOwnProperty('ok')) {
			channel.send(message.message);
			return message.message;
		}
	}
	return Extensions;
}();
module.exports = Extensions;
