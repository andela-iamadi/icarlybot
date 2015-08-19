var Reminder;

Reminder = function() {
	var that;
	function Reminder(objTask, slack){
		that = this;
		this._task = null;
		this._due_time = null;
		this._due_date = null;
		this._rem = null;
		this._channel = null;
		this._isDM = null;
		this._hasError = null;
		this._slack = slack || null;
	}

	Reminder.prototype.setReminder = function(objTask, channel, isDM) {
		that._task = objTask["task"];
		if (this.reminderShouldBeSet()) {
			that._due_time = that._task["due_time"] || "00:00";
			that._due_date = that._task["due_date"] || new Date();
			that._channel = channel;
			that._isDM = isDM;

	    that._rem = this.setTimeOut(this.reminderMsg);
	    if (that._rem) {
	      return channel.send(">A reminder to task `" + that._task["alias"] + "` has been set");
	    }
	  }
		return false;
	}

	// These functions are private

	Reminder.prototype.reminderShouldBeSet = function(){
	  return ((typeof that._task["due_time"] !== "undefined") && ( that._task["operation"] === "create" || that._task["operation"] === "update"));
	}

	Reminder.prototype.reminderMsg = function(){
	  if (that._isDM) {
	    that._channel.send(">Reminder: `" + that._task["task"] + " `");
	  } else {
	    	that._channel.send(">Hey @channel, ```Reminder: " + that._task["task"] + " ```");
	  }
	}

	Reminder.prototype.setTimeOut = function(callback){
		var due_date = this.formatTime(that._due_time, that._due_date);
		return this.setToHappen(due_date, callback);
	}

	Reminder.prototype.setToHappen = function (d, callback) {
		var time_diff = d.getTime() - (new Date()).getTime();
		return setTimeout(callback, time_diff);
	}

	Reminder.prototype.formatTime = function (strTime, strDate) {
		var due_date = new Date(strDate);
		var index = strTime.indexOf(":");
		var h = 0, m = 0;
		if (strTime) {
			if (index != -1) {
				h = parseInt(strTime.substr(0, index)) || 0;
				m = parseInt(strTime.substr(index + 1)) || 0;
			}
			if (strTime.indexOf('pm') != -1 ) {
	 			h = h > 12 ? h : h + 12
			}
		}
		var _time = new Date();
		due_date.setHours(h);
		due_date.setMinutes(m);
		due_date.setSeconds(0);
		return due_date;
	};

	Reminder.prototype.setAllTimers = function(arrTasks) {
		var channel, user, isDM;
		arrTasks.map(function(task){
			task = JSON.parse(task);
			channel = that._slack.getChannelGroupOrDMByID(task["message_channel"]);
			user = that._slack.getUserByID(task["user_channel"]);
			isDM = channel.id == user.id ? true : false;

		  this.setReminder(task, channel, isDM);
		});
	}
	return Reminder;
}();
module.exports = Reminder;
