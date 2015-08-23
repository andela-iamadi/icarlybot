var Tasks;
var Api = require('../services/apiService');

Tasks = function() {
	function Tasks(){
		this.params = null;
		this._api = new Api();
	}

	Tasks.prototype.create = function(params, callback){
		this.params = params;
		// Post so we can sneak in parameters
		return this._api.processRequest('/api/v1/tasks', "POST", params, callback);
	}

	Tasks.prototype.update = function(params, callback) {
		this.params = params;
		return this._api.processRequest('/api/v1/tasks/id', "PATCH", params, callback);
	}

	Tasks.prototype.show = function(params, callback) {
		this.params = params;
		return this._api.processRequest('/api/v1/tasks/all', "POST", params, callback);
	}

	Tasks.prototype.delete = function(params, callback){
		this.params = params;
		return this._api.processRequest('/api/v1/tasks/id', "DELETE", params, callback);
	}

	Tasks.prototype.callBack = function(data) {
		return data;
	}

	return Tasks;
}();
module.exports = Tasks;
