var Tasks;
var Api = require('../services/apiService');
var Translator = require('../shared/translator');

Tasks = function() {
	function Tasks(){
		this.params = "";
		this._api = null;
		this._translator = null;
	}

	Tasks.prototype.create = function(params, callback){
		debugger;
		this.params = params;
		return this._api = new Api('/api/v1/tasks', "POST", params, this.callback);
	}

	Tasks.prototype.update = function() {
		this.params = params;
		this._api = new Api('/api/v1/tasks', "PUT", params, this.callback);
	}

	Tasks.prototype.show = function() {
		this.params = params;
		this._api = new Api('/api/v1/tasks', "GET", params, this.callback);
	}

	Tasks.prototype.delete = function(){
		this.params = params;
		return this._api = new Api('/api/v1/tasks', "DELETE", params, this.callback);
	}

	Tasks.prototype.callBack = function(data) {
		return data;
	}

	return Tasks;
}();
module.exports = Tasks;
