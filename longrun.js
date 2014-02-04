LongRun = function() {

  this._success_functions = {};
  this._failure_functions = {};
  this._poll_functions = {};
  this._names = [];

  //var _default_fail = function(name, msg) {
  //     window.alert(name+" failed:\n"+msg)
  //}

  var register = function(name, success, failure, poll) {
    this._success_functions[name] = success;
    this._failure_functions[name] = failure;
    this._poll_functions[name] = poll;
    this._names.push(name)
  };

  var _invoke = function () {window.alert("nope nope nope _invoke")}

  var get_one_state = function(name) {
    console.log("get_one "+name)
    console.log("get_one_this"+this)
    var raw_state = this._invoke(["~/bin/longrun.state", name]);
    // TODO: make the above async, but keep below not async.
    var state = $.parseJSON(raw_state);
    if (state['status'] === 'success') {
	this._success_functions[name](name, state['msg'])
    } else if (state['status'] === 'failure') {
	this._failure_functions[name](name, state['msg'])
    } else if (state['status'] === 'running') {
	this._poll_functions[name](name, state['msg'])
        //this._poll(name)
    } else if (state['status'] === 'killed') {
	this._failure_functions[name](name, state['msg'])
    } else {
	console.log("Didn't know what to do with status "+status)
    }
  }

  var get_state = function() {
      for (var i=0; i<this._names.length; i++) {
	  var name = this._names[i]
	  this.get_one_state(name)
      }
  }

  var _poll = function(name, msg) {
    console.log("_poll:"+name+" "+msg)
    console.log("_poll this"+this)
    var that = this
    window.setTimeout(function(name){that.get_one_state(name)}, 10000, name)
  }

  this.register = register
  this._invoke = _invoke
  this.get_one_state = get_one_state
  this.get_state = get_state
  this._poll = _poll

}
