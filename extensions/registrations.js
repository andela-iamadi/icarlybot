var Registration, API;
API = require('./callToAPI');

var querystring = require('querystring');

Registration = function () {
	function Registration () {
		this.channel = null;
		this.user = null;
		this.response = null;
	}

	Registration.prototype.startReg = function(channel, user, response, conversation) {
  	console.log("Got to registration: User :" + querystring.stringify(user));
    var allSteps = ["start", "session", "end"];
    var params = {
      "auto" : {
        first_name: user.first_name,
        last_name: user.last_name,
        image: user.image_original,
        username: user.user,
        password: user.name
      },
      "session" : ""
    }
    var steps = {
      "start" : "Okay " + user.name + ", so let's begin your registration process. I would register you as " + user.real_name + " with email: " + user.profile.email + ". Type in 'Ok' if you are okay with this.",
      "session" : "Which session would you prefer? Morning or Evening",
      "end" : "Thanks for registering. Whenever you attend any Improv session, just send me 'present' so I can forward your request for approval. Have a wonderful day!"
    }

    console.log("Got to top of conversation");
    if (conversation.status === true) {
      console.log("To start API call");
      var apiCall = new API(params["auto"], "POST", "/fellows", showServerResponse);
        console.log("ended API call");
      channel.send(steps[conversation.step]);
      if (conversation.step === "end") {
        conversation.status = false;
      } else {
        conversation.status = true;
        conversation.step = nextItem(allSteps, conversation.step);
      }
    } else {
      channel.send(steps["start"]);
    }

		Registration.prototype.nextItem = function(array, value) {
		  var item = array.indexOf(value)
		  if (item > -1 & (item + 1) > -1) {
		    return item + 1;
		  }
		  return false;     // Item not found in array
		}
	}
	return Registration;
}();

module.exports = Registration;
