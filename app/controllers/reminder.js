var Reminder;
Task = require('./tasks');

Reminder = function() {
	var that;
	function Reminder(slack){
		that = this;
		this._task = null;
		this._due_time = null;
		this._due_date = null;
		this._rem = null;
		this._channel = null;
		this._isDM = null;
		this._hasError = null;
		this._slack = slack || null;
		this._taskClass = new Task();
		this._params = null;
	}

	Reminder.prototype.setReminder = function(objTask, channel, user, isDM) {
		that._task = objTask;
		if (that.reminderShouldBeSet()) {
			that._due_time = that._task["due_time"] || "00:00";
			that._due_date = that._task["due_date"] || new Date();
			that._channel = channel;
			that._isDM = isDM;
			that._due_date = that.formatTime(that._due_time, that._due_date);
	    return that._rem = that._setTimeOut(that.reduceMinutes(that._due_date, 5), function() {
				that.setReminderIfTaskExists(that._due_date, objTask, channel, user, isDM);
			});
	  }
		return false;
	}

	// These functions are private

	Reminder.prototype.reduceMinutes = function (objTime, num) {
		return new Date(objTime.setMinutes(objTime.getMinutes() - num));
	}

	Reminder.prototype.incrementMinutes = function (objTime, num) {
		return new Date(objTime.setMinutes(objTime.getMinutes() + num));
	}

	Reminder.prototype.reminderShouldBeSet = function(){
	  return (typeof that._task["due_time"] !== "undefined");
	}

	Reminder.prototype.reminderMsg = function(due_date, task, channel, user, isDM){
	  if (isDM) {
	    channel.send(">Reminder: `" + task["task"] + " `");
	  } else {
	    channel.send(">Hey @channel, ```Reminder: " + task["task"] + " ```");
	  }
		// Set task to remind the next day
		due_date = new Date(due_date.setDate(due_date.getDate() + 1));
		that._setTimeOut(that.reduceMinutes(due_date, 5), function() {
			that.setReminderIfTaskExists(due_date, objTask, channel, user, isDM);
		});
	}

	Reminder.prototype.setReminderIfTaskExists = function(due_date, task, channel, user, isDM) {
	 	this._params = { task : task, user : { username : user.name }}
		that._taskClass.show(this._params, function(data) {
			data = JSON.parse(data);
			if (!data.hasOwnProperty("ok") && data.hasOwnProperty("message")) {
				that._setTimeOut(that.incrementMinutes(due_date, 5), function() {
					that.reminderMsg(due_date, task, channel, user, isDM)
				});
			}
		});
	}

	Reminder.prototype._setTimeOut = function(due_date, callback){
		return this.setToHappen(due_date, callback);
	}

	Reminder.prototype.setToHappen = function (d, callback) {
		var time_diff = d.getTime() - (new Date()).getTime();
		return setTimeout(callback, time_diff);
	}

	Reminder.prototype.formatTime = function (strTime, strDate) {
		try {
			var due_date = new Date(strDate);
			var tIndex = strTime.indexOf("T"); // Check if its a date_time formatted string from db
			if (tIndex != -1) { strTime = strTime.substring(tIndex + 1, 19) } //format if its db date_time
			var index = strTime.indexOf(":");
			var h = 0, m = 0;
			if (index != -1) {
				h = parseInt(strTime.substr(0, index)) || 0;
				m = parseInt(strTime.substr(index + 1)) || 0;
			}
			if (strTime.indexOf('pm') != -1 ) {
	 			h = h > 12 ? h : h + 12
			}
			var _time = new Date();
			due_date.setHours(h);
			due_date.setMinutes(m);
			due_date.setSeconds(0);
			return due_date;
		} catch (err) {
			return new Date();
		}
	};

	Reminder.prototype.setAllTimers = function(arrTasks) {
		var channel, user, isDM;
		try {
			if (arrTasks) {
			 	arrTasks = JSON.parse(arrTasks);
				arrTasks = arrTasks["message"]
				var task = {};
				for (i = 0; i < arrTasks.length; i++) {
					task = arrTasks[i];
					if (!task["message_channel"] && !task["user_channel"]) continue
					channel = that._slack.getChannelGroupOrDMByID(task["message_channel"]);
					user = that._slack.getUserByID(task["user_channel"]);
					isDM = channel.user === user.id ? true : false;
				  that.setReminder(task, channel, user, isDM);
				}
			} else {
				console.log("No data was received to reset timers");
			}
		} catch (err) {
		console.log(err.message);
		}
	}
	return Reminder;
}();
module.exports = Reminder;
