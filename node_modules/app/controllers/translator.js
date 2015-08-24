var Translator;

Translator = function() {
	function Translator(response, user) {
		this._response = response;
		this._operations = { n : "create", s : "show", e : "update", x : "delete" }
		this._keywords = {ta: "task", users : "user", t : "due_time", d : "due_date", a : "alias", r : "reminder", c : "category", f : "frequency", u : "user_name" };
		this._str_param = "";
		this._params = {};
	}

	Translator.prototype.translate = function (response) {
		if (response.length > 4) {
			response = response.replace("%20", " ").trim();;
			var subText = response.substring(0, 4).toLowerCase();
			// Find controller
			if (subText === "task" || subText == "user") {
				this._params["controller"] = subText;
				return this.searchForKeyword(response, this._params["controller"]);
			}
			else {
				return {'ok' : false, 'message' : "Okay, something went wrong. Try starting your message with the `task` keyword or send `help` to get started." }
			}
		}
		return {'ok' : false, 'message' : "Uh oh.. I think your message is too short. send `help` to see a sample message." }
	}

	Translator.prototype.searchForKeyword = function (text, opClass) {
		var wordArray = opClass === "task" ? this.task_operation_list : this.user_operation_list;
		var startIndex = opClass.length;
		var endIndex = 0;
		var inValue = true;
		var keyFound = true;
		var key = opClass.substring(0, 2);
		var opFound = false;
		var word = "";
		this._params["operation"] = "create";		// A default operator, in case the user doesn't specify;
		while (endIndex <= text.length) {			// keep doing stuff while in the sentence
			if (text.substring(endIndex, endIndex + 2) === "--" || endIndex >= text.length) {
				if (inValue) {
					word = text.substring(startIndex, endIndex).trim()
					if (key == "d" && word == "") { word = new Date(); }
					if (word.length > 0) { this._params[this._keywords[key]] = word; }
					// reset cursory check
					startIndex = endIndex + 2;
					keyFound = false;
					inValue = false;
				}
				if (!inValue) {
					endIndex += 2;
					if (!opFound && this._operations.hasOwnProperty(text[endIndex])) {
							this._params["operation"] = this._operations[text[endIndex]];
							opFound = true;
							startIndex = endIndex;
							endIndex += 1;
							keyFound = false;
					} else if (this._keywords.hasOwnProperty(text[endIndex])) {
						key = text[endIndex];
						console.log("the key check: " + key);
						startIndex = endIndex + 1;
						// endIndex += 1;
						inValue = true;
					}
				}
			}
			endIndex++;
		}
		return this._params;
	};

	return Translator;
}();
module.exports = Translator;
