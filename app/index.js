var CueBot, Users, Tasks, Translator;

User = require('./controllers/users');

Task = require('./controllers/tasks');

Reminder = require('./controllers/reminder');

Help = require('./controllers/help');

Translator = require('./controllers/translator');

Enumerables = require('./helpers/enumerables');


CueBot = function() {
	var that;
	function CueBot(slack) {
		that = this;
		this._params = {};
		this._control = {};
		this._operator = null;  // Operator could be either task or user, depending on incoming message
		this._channel = null;
		this._message = null;
		this._user = null;
		this._task = null;
		this._help = new Help();
		this._isDM = false;
		this._slack = slack
		this._translator = new Translator();
		this._enums = new Enumerables();
		this._reminder = new Reminder(slack);
		this._reminderSet = false;
	}

	CueBot.prototype.handleReq = function (message, user, channel) {
		that._channel = channel;
		that._user = user;
		that._message = message;
		try {
			that._isDM = that._enums.checkForDM(that._channel, that._message);
			if (that._message.type === 'message') {
				if (that._isDM) {
					// Send to API Function ...
					that.routeReq(that._user, that._message, that.handleDataFromAPI);
				}
				else if (that._enums.isDirect(that._slack.self.id, message.text)) {
					that._channel.send(that.help("sendDM")); // Request for a DM
				}
			}
		}
		catch (error) {
			console.log(error.message);
		}
	}

	CueBot.prototype.routeReq = function(user, message, callback) {
		if (message.text.substring(0, 4).toLowerCase() === "help") {
			return that._channel.send(this._help.show_help(user, message.text.substring(4).trim()));
		}
		var messageID = message.channel || "";
		var userID = message.user || "";
		this._control = this._translator.translate(message.text);
		this._control = this.addChannels(this._control, messageID, userID);
		that._params[this._control["controller"]] = this._control;
		that._params["user"] = this.userDetails(user);
		// return if there's an issue with the commands from user
		if (this._control.hasOwnProperty('ok')) {
			return callback(this._control);
		}

		this._operator = this._control["controller"] == "task" ? new Task() : new User();

		switch (this._control["operation"]) {
			case "create":
				return this._operator.create(that._params, callback);
			case "show":
				return this._operator.show(that._params, callback);
			case "update":
				return this._operator.update(that._params, callback);
			case "delete":
				return this._operator.delete(that._params, callback);
			default:
				return this._help.show_help("welcome");
		}
	}

	CueBot.prototype.addChannels = function(params, messageID, userID) {
		params["message_channel"] = messageID;
		params["user_channel"] = userID;
		return params;
	}
	CueBot.prototype.handleDataFromAPI = function(data){
	  if (typeof(data) != "object") {
	    data = JSON.parse(data);
	  }

		var hasError = data.hasOwnProperty("ok") ? true : false;
	  data = hasOwnProperty.call(data, "message") ? data["message"] : that.help(that._user, "error");
	  data = JSON.stringify(data, null, 4).trim();
		that._channel.send(that._enums.preProcessString(data));
		that._task = that._params["task"];
		if (!hasError && that.reminderShouldBeSet(that._task)) {
			that._reminderSet = that._reminder.setReminder(that._task, that._channel, that._user, that._isDM);
	    if (that._reminderSet) {
	      return that._channel.send([">>>A reminder to task `" + that._task["alias"] + "` has been set",
														" ",
														"To view this task at anytime, send ",
														"`task --s --a " + that._task["alias"] + "` ",
														" ",
														"`--s : show, --x : delete, --e : edit, --a : alias` "].join("\r\n"));
	    }

		} else if (hasError) {
			return hasError;
		}
	}

	CueBot.prototype.reminderShouldBeSet = function(task){
	  return ((typeof task["due_time"] !== "undefined") && ( task["operation"] === "create" || task["operation"] === "update"));
	}

	CueBot.prototype.setReminder = function(hasError) {
		if (!hasError) {
			return that._reminder.setReminder(that._params["task"], that._channel, that._user, that._isDM);
		} else {
			return hasError;
		}
	}

	CueBot.prototype.setAllReminders = function() {
		try {
			var bot_response = { text: "task --s" }
			var user = { name: "cueBot", profile: "" };
			this.routeReq(user, bot_response, that._reminder.setAllTimers);
		} catch (err) {
			console.log(err.message);
		}
	}

	CueBot.prototype.translate = function(response) {
		return this._translator.translate(message);
	}

	CueBot.prototype.help = function(user, scope){
		this._help = new Help();
		return this._help.show_help(user, scope);
	}

	CueBot.prototype.userDetails = function(user){
		return {
			username : user.name,
			first_name : user.profile.first_name || "",
			last_name : user.profile.last_name || "",
			email : user.profile.email || ""
		};
	}

	return CueBot;
}();
module.exports = CueBot;
