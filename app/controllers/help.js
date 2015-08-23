var Help;

Help = function(){
	function Help() {
		this._user = "";
		this._scope = "";
	};

	Help.prototype.show_help = function(user, scope) {
		this._user = user;
		this._scope = typeof scope !== 'undefined' ? scope : "general";
		switch (this._scope) {
			case "show":
				return this.show();
			case "edit":
				return this.edit();
			case "delete":
				return this.delete();
			case "sendDM":
				return this.sendDM();
			case "all":
				return this.welcome_all();
			case "error":
				return this.unidentified_error();
			default:
				return this.welcome();
		}
	}

	Help.prototype.general = function(){
		var msg = "Hi " + this._user.name + ", help me understand your message better. If you've got a second, send `help` so I can send you brief commands to get you started :smile:";
		return msg;
	}


	Help.prototype.edit = function(){
		var msg = ["To edit a task, specify its alias and include the edit flag (--e).",
		           "Then every other option you provide would replace existing ones.",
		           "For example,",
		           "```task send freckle reminders to me --e --t 10:00am --a freckle```",
		           "changes an existing task with alias 'freckle' to:",
		           "```",
		           "task: send freckle reminders to me",
		           "time: 10:00am",
		           "```"].join("\r\n");
		return msg;
	}

	Help.prototype.welcome = function(){
		return msg = ["Hi " + this._user.name + ", thanks for hiring my services :smile:",
							 ">>>",
							 "To set a  reminder, just type:",
							 ">`task [message] [options]`",
							 "",
							 "where",
							 ">*_message_*: The message you wish me to remind you.",
							 ">*_options_*: Additional options to add details. They include:-",
							 "",
							 "*Operation flags*",
							 "",
							 ">--e : to edit a task",
							 ">--s : to show tasks",
							 ">--x : to delete a task",
							 "",
							 "*_For example,_*",
							 "",
							 ">`task Log freckle --t 09:00 am --a freckle`",
							 "",
							 "" + this.dmAuthor() ].join('\r\n');
	}

	Help.prototype.welcome_all = function(){
		var msg = ["Hi " + this._user.name + ", thanks for hiring my services :smile:",
							 ">>>",
							 "To set a  reminder, just type:",
							 ">`task [message] [options]`",
							 "",
							 "where",
							 ">*_message_*: The message you wish me to remind you.",
							 ">*_options_*: Additional options to add details. They include:-",
							 "",
							 "*Operation flags*",
							 "",
							 ">--e : to edit a task",
							 ">--s : to show tasks",
							 ">--x : to delete a task",
							 "",
							 "If no operation flag is specified, a new task is created.",
							 "",
							 "*Condition flags*",
							 "",
							 ">--t :	[_compulsory_] time the event is due.",
							 ">--a : [_compulsory_] Alias for the event. This will be used to subsequently refer to the event.",
							 ">--d : [_optional_] Date the event is due. The default is the same day it was set.",
							 ">--r : [_optional_] Minutes before you wish the reminder to be sent [in minutes]. The default is 15 minutes.",
							 ">--c : [_optional_] The channel you wish the reminder to be sent. If none is specified, I will send the message as a DM to you.",
							 "",
							 "*Sample message*",
							 "",
							 "*_The message_*",
							 "",
							 ">`task Start freckle time --t 09:00 am --a freckle`",
							 "",
							 "*_translates to_*",
							 "",
							 ">task: Start freckle time",
							 ">due time: 09:00 am",
							 ">alias: freckle",
							 ">due date: _[today's date]_",
							 ">reminder: 15 minutes",
							 ">category: personal",
							 "",
							 "To learn more about other operations, send",
							 "",
							 ">`help [operation]`",
							 "",
							 "_For example_,",
							 "",
							 ">`help show` or `help edit` or `help delete`",
							 "",
						   "" + this.dmAuthor() ].join('\r\n');
		return msg;
	}

	Help.prototype.show = function(){
		var msg = [
							">>>",
							"To show all reminders/tasks running for today, send `task --s`",
							"",
							"However, if you wish to specify a task, type in the alias, e.g.",
							"",
							">`task --s --a freckle`",
							"",
							"to retrieve the task with alias freckle.",
							"you could also see tasks in a specified date by typing the date (dd-mm-yyyy). e.g.",
							"",
							"`task --s --d 08-08-2015`",
							"",
							"gets you all task at that date.",
							"",
							" " + this.dmAuthor() ].join('\r\n');
		return msg;
	}

	Help.prototype.delete = function(){
		var msg =	[">>>To delete a task, specify its alias and include the edit flag (--x).",
							 "Then every other option you provide would replace existing ones.",
							 "For example,",
							 "",
							 "*task --x --a freckle*",
							 "",
							 "deletes an existing task with alias 'freckle'.",
							 "",
							 "" + this.dmAuthor() ].join('\r\n');;
		return msg;
	}

Help.prototype.unidentified_error = function(){
		return ">Well, this is embarrassing. An error I can't identify occured somewhere. Please try again.";
	}

	Help.prototype.sendDM = function(){
		return "Hi @" + this._user.name + ", why don't you send me a DM, so we can talk better. Thank you. :thumbsup: ";
	}

	Help.prototype.dmAuthor = function() {
		return "If you'd appreciate more information or wish to share some feedback, consider sending a DM to @cent. Thanks for using me :smile:";
	}

	return Help;
}();
module.exports = Help;
