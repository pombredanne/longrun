var longrun = {};

longrun._nuke_state = function() {
    longrun._success_functions = {};
    longrun._failure_functions = {};
    longrun._poll_functions = {};
    longrun._names = [];
}

longrun._nuke_state()

longrun.register = function(name, success, failure, poll) {
    longrun._success_functions[name] = success;
    longrun._failure_functions[name] = failure;
    longrun._poll_functions[name] = poll;
    longrun._names.push(name)
};

// longrun._invoke = function () {}

longrun.get_state = function() {
    for (var i=0; i<longrun._names.length; i++) {
        var name = longrun._names[i]
        var raw_state = longrun._invoke(["~/bin/longrun/state", name]);
        // TODO: make the above async, but keep below not async.
        var state = $.parseJSON(raw_state);
        if (state['status'] === 'success') {
            longrun._success_functions[name](state['msg'])
        } else if (state['status'] === 'failure') {
            longrun._failure_functions[name](state['msg'])
        } else if (state['status'] === 'running') {
            longrun._poll_functions[name](state['msg'])
        } else if (state['status'] === 'killed') {
            longrun._failure_functions[name](state['msg'])
        } else {
            console.log("Didn't know what to do with status "+status)
        }
    }
}
