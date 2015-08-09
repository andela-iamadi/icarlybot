var Tasks;
var Api = require('../services/apiService');

Tasks = function() {
	function Tasks(){
		this.params = null;
		this._api = new Api();
	}

	Tasks.prototype.create = function(params, callback){
		debugger;
		this.params = params;
		return this._api.processRequest('/api/v1/tasks', "POST", params, callback);
	}

	Tasks.prototype.update = function(params, callback) {
		this.params = params;
		return this._api.processRequest('/api/v1/tasks', "PUT", params, callback);
	}

	Tasks.prototype.show = function(params, callback) {
		this.params = params;
		console.log("About to make the call with the params: " + JSON.stringify(this.params) + " with callback " + typeof callback)
		return this._api.processRequest('/api/v1/tasks', "GET", params, callback);
	}

	Tasks.prototype.delete = function(params, callback){
		this.params = params;
		return this._api.processRequest('/api/v1/tasks', "DELETE", params, callback);
	}

	Tasks.prototype.callBack = function(data) {
		return data;
	}

	return Tasks;
}();
module.exports = Tasks;
