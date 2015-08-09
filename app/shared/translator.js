var Translator;

Translator = function() {
	function Translator(response, user) {
		this._response = response;
		this._keywords = {ta: "task", users : "user", n : "create", s : "show", e : "update", x : "delete", t : "time", d : "date", a : "alias", r : "reminder", c : "category", u: "user_name" };
		this._str_param = "";
		this._params = {};
	}

	Translator.prototype.getParams = function (response) {
		if (response.length > 4) {
			response = response.replace("%20", " ").trim();;
			var subText = response.substring(0, 4).toLowerCase();
			// Find controller
			if (subText === "task" || subText == "user") {
				this._params["controller"] = subText;
				return result = this.searchForKeyword(response, this._params["controller"]);
			}
			else {
				return {'ok' : false, 'msg' : "Okay, something went wrong. Try starting your message with the `task` keyword." }
			}
		}
		return {'ok' : false, 'msg' : "Uh oh.. I think your message is too short. I don't quite understand it." }
	}

	Translator.prototype.searchForKeyword = function (text, opClass) {
		var wordArray = opClass === "task" ? this.task_operation_list : this.user_operation_list;
		var startIndex = opClass.length;
		var endIndex = 0;
		var inValue = true;
		var key = opClass.substring(0, 2);
		while (endIndex <= text.length) {			// keep doing stuff while in the sentence
			if (text.substring(endIndex, endIndex + 2) === "--" || endIndex >= text.length) {
				if (inValue) {
					this._params[this._keywords[key]] = text.substring(startIndex, endIndex).trim();
					// reset cursory check
					startIndex = endIndex + 2;
					endIndex += 2;
					inValue = false;
				}
				if (!inValue) {
					if (this._keywords.hasOwnProperty(text[endIndex])) {
						key = text[endIndex];
						startIndex = endIndex + 1;
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
