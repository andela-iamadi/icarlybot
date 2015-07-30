var Users;
var Api = require('../services/apiService');

Users = function() {
	function Users(){
		this.params = "";
		this._api = null;
		this._translator = null;
	}

	Users.prototype.create = function(params, callback){
		debugger;
		this.params = params;
		return this._api = new Api('/api/v1/users', "POST", params, this.callback);
	}

	Users.prototype.update = function() {
		this.params = params;
		this._api = new Api('/api/v1/users', "PUT", params, this.callback);
	}

	Users.prototype.show = function() {
		this.params = params;
		this._api = new Api('/api/v1/users', "GET", params, this.callback);
	}

	Users.prototype.delete = function(){
		this.params = params;
		return this._api = new Api('/api/v1/users', "DELETE", params, this.callback);
	}

	Users.prototype.callBack = function(data) {
		return data;
	}

	return Users;
}();
module.exports = Users;
