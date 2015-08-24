var Enumerables;

Enumerables = function() {
	function Enumerables(){

	}

	Enumerables.prototype.makeMention = function(userId) {
		return '<@' + userId + '>';
	};

	Enumerables.prototype.isDirect = function(userId, messageText) {
		var userTag = this.makeMention(userId);
		return messageText &&
						messageText.length >= userTag.length &&
						messageText.substr(0, userTag.length) === userTag;
	};

	Enumerables.prototype.getOnlineHumansForChannel = function(channel) {
	    if (!channel) return [];

	    return (channel.members || [])
	        .map(function(id) {
						return slack.users[id];
					})
	        .filter(function(u) {
						return !!u && !u.is_bot && u.presence === 'active';
					});
	};

	Enumerables.prototype.preProcessString = function(str) {
	  str = this.replaceAll(str, "[", "");
	  str = this.replaceAll(str, "]", "");
	  str = str.replace(/}/g, "```");
	  str = str.replace(/{/g, "```");
	  str = this.replaceAll(str, ",", "");
	  str = this.replaceAll(str, "\"", "");
	  str = this.replaceAll(str, "_", " ");
	  return str;
	}
	Enumerables.prototype.escapeRegExp = function (string) {
	    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	}

	Enumerables.prototype.replaceAll = function (string, find, replace) {
	  return string.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
	}

	Enumerables.prototype.checkForDM = function(channel, message) {
	  if (message.type === 'message') {
	    try {
	      if (typeof(channel.members) === 'undefined') {
	        return true;
	      }
	    } catch (err) {
	      console.log(err.message);
	    }
	  }
	  return false;
	}

	return Enumerables;
}();

module.exports = Enumerables;
