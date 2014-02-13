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

  var _invoke = function (command, success) {
    var text_command = command.join('')
    var _exec_fail = function(command, success, response){
      console.log("Server unhappy: "+response);
      window.setTimeout(_invoke, 10000, command, success)
    }

    scraperwiki.exec(text_command,
                     success,
                     function(response){_exec_fail(command, success, response)})
  }

  var start = function(name, command) {
      // TODO: nice escaping of command!
      var full_command = ["~/bin/longrun.start ", name, " "].concat(command);
      this._invoke(full_command);
    };

  var start_and_get_state = function(name, command) {
      var full_command = ["~/bin/longrun.start ", name, " "].concat(command);
      var that = this
      this._invoke(full_command, function(){that.get_one_state(name)})
  };
      

  var get_one_state = function(name) {
    console.log("get_one "+name)
    console.log("get_one_this"+this)

    var that = this
    this._invoke(["~/bin/longrun.state ", name], 
                 function(stdout){that._call_state_function(name, stdout)});
  };

  var _call_state_function = function(name, raw_state) {
    console.log("RAW:"+raw_state)
    // TODO: make the above async, but keep below not async.
    // TODO: refactor so all success/failure function just take state?
    //       ... or at least not taking them in reverse order.
    var state = $.parseJSON(raw_state);
    if (state['status'] === 'success') {
	this._success_functions[name](name, state['msg'])
    } else if (state['status'] === 'failure') {
	this._failure_functions[name](name, state['msg'], state['status'])
    } else if (state['status'] === 'running') {
	this._poll_functions[name](name, state['msg'])
        //this._poll(name)
    } else if (state['status'] === 'killed') {
	this._failure_functions[name](name, state['msg'], state['status'])
    } else if (state['status'] === 'not run') {
        this._failure_functions[name](name, state['msg'], state['status'])
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
    var that = this
    console.log("polling for real: "+name)
    window.setTimeout(function(name){that.get_one_state(name)}, 10000, name)
  }

  this.register = register
  this._invoke = _invoke
  this.get_one_state = get_one_state
  this.get_state = get_state
  this._poll = _poll
  this.start = start
  this._call_state_function = _call_state_function
  this.start_and_get_state = start_and_get_state

}
