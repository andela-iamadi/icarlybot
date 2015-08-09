
var Slack = require ('slack-client');
var https = require('http');
var Routers = require('./helpers');

var querystring = require('querystring');
var conversation = {
  status: false,
  operation: "",
  step: ""
}
var sessionId = "1234";

// var token = 'xoxb-7916142720-gNfXEy3hOIHLUTM3Ol4rUk0e';
var token = 'xoxb-7916142720-K7Y3B53B2ClllVYuaWvzLry4';
autoReconnect = true
autoMark = true

var slack = new Slack(token, autoReconnect, autoMark);
var router = new Routers();

slack.on('open', function () {

    var channels = Object.keys(slack.channels)
        .map(function (k) { return slack.channels[k]; })
        .filter(function (c) { return c.is_member; })
        .map(function (c) { return c.name; });

    var groups = Object.keys(slack.groups)
        .map(function (k) { return slack.groups[k]; })
        .filter(function (g) { return g.is_open && !g.is_archived; })
        .map(function (g) { return g.name; });
    console.log('Welcome to Slack. You are ' + slack.self.name + ' of ' + slack.team.name);

    if (channels.length > 0) {
        console.log('You are in: ' + channels.join(', '));
    }
    else {
        console.log('You are not in any channels.');
    }

    if (groups.length > 0) {
       console.log('As well as: ' + groups.join(', '));
    }
});


var makeMention = function(userId) {
	return '<@' + userId + '>';
};

var isDirect = function(userId, messageText) {
	var userTag = makeMention(userId);
	return messageText &&
					messageText.length >= userTag.length &&
					messageText.substr(0, userTag.length) === userTag;
};

var getOnlineHumansForChannel = function(channel) {
    if (!channel) return [];

    return (channel.members || [])
        .map(function(id) {
					return slack.users[id];
				})
        .filter(function(u) {
					return !!u && !u.is_bot && u.presence === 'active';
				});
};

slack.on('message', function(message) {
		console.log("message sent: " + message);
    var channel = slack.getChannelGroupOrDMByID(message.channel);
    var user = slack.getUserByID(message.user);

    console.log("Starting the checks with conversation status: " + conversation.status + " for channel members " + querystring.stringify(channel) + "\r\n the original channel: " + message.channel);
    try {
      var isDM = checkForDM(channel, message);
      if (message.type === 'message') {

          if (isDM) {
              // Send to API Function
              console.log("send to router");
              var resp = router.routeReq(channel, user, message.text, function(data){
                channel.send(data);
              });
          }
          else if (isDirect(slack.self.id, message.text)) {
            channel.send("Hi @" + user.name + ", it would be better you send me a DM. Thank you. :thumbsup: ");
          }

      }
    }
    catch (error) {
      console.log(error.message);
    }
        // var onlineUsers = getOnlineHumansForChannel(channel)
        //     .filter(function(u) { return u.id != user.id; })
        //     .map(function(u) { return makeMention(u.id); });

        // channel.send(onlineUsers.join(', ') + '\r\n' + user.real_name + ' said: ' + trimmedMessage);
});


var checkForDM = function(channel, message) {
  if (message.type === 'message') {
    try {
      console.log("Read members");
      if (typeof(channel.members) === 'undefined') {
        console.log("Done reading members");
        return true;
      }
    } catch (err) {
      console.log(err.message);
    }
  }
  return false;
}

var showServerResponse = function(response, channel) {
    console.log("Gotten server from server: " + querystring.stringify(response));
    channel.send(response);
}

slack.on ('error', function(error) {
  console.error("Error: " + error);
});

slack.login();
