describe("Longrun", function(){

longrun.should.be.ok;

describe("register", function(){

it("should kinda work", function () {
// longrun.register

longrun.register.should.be.ok;
longrun.register("test", "succ", "fail", "poll");
longrun.register("again", "ok", "bad", "poke");
longrun._names.should.eql(["test", "again"]);
longrun._success_functions.should.eql({"test": "succ", "again": "ok"});
longrun._failure_functions.should.eql({"test": "fail", "again": "bad"});
longrun._poll_functions.should.eql({"again": "poke", "test": "poll"});
})
})

// longrun._nuke_state

describe("nuke", function(){

it("should kinda work", function () {
longrun._nuke_state();
longrun.register.should.be.ok;
longrun._names.should.be.empty;
longrun._success_functions.should.be.empty;
longrun._failure_functions.should.be.empty;
longrun._poll_functions.should.be.empty;
})
})

describe("get_state", function(){

it("should kinda work", function () {
// longrun.get_state
longrun._invoke = function (commands) {
    return JSON.stringify({"status": commands[1], "msg": commands[1]})
    // override _invoke for testing
}

var never_run = function(msg) {
    console.log("never_run: "+msg)
    never_run.should.not.be.ok;  // you should never run this function
}

var collect_done = []

done = function(msg) {
    collect_done.push(msg)
}

var fail = done;
var poll = done;
die = done;

longrun.register('success', done, never_run, never_run);
longrun.register('failure', never_run, fail, never_run);
longrun.register('running', never_run, never_run, poll);
longrun.register('killed', never_run, die, never_run);

longrun.get_state()
collect_done.should.be.eql(['success', 'failure', 'running', 'killed'])
})})
})
