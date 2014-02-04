var never_run = function(msg) {
  console.log("never_run: "+msg)
  never_run.should.not.be.ok;  // you should never run this function
}

describe("Longrun", function(){
  LongRun.should.be.ok;

  describe("register", function(){
    it("has populated data structures correctly", function () {
      var longrun = new LongRun()
      longrun.register("test", "succ", "fail", "poll");
      longrun.register("again", "ok", "bad", "poke");
      longrun.register.should.be.ok;
      longrun._names.should.eql(["test", "again"]);
      longrun._success_functions.should.eql({"test": "succ", "again": "ok"});
      longrun._failure_functions.should.eql({"test": "fail", "again": "bad"});
      longrun._poll_functions.should.eql({"again": "poke", "test": "poll"});
    })
  })

  it("is classlike", function () {
    var longrun = new LongRun()
    var other_longrun = new LongRun()
    other_longrun.register("a","b","c","d");
    longrun.register.should.be.ok;
    longrun._names.should.be.empty;
    longrun._success_functions.should.be.empty;
    longrun._failure_functions.should.be.empty;
    longrun._poll_functions.should.be.empty;
    other_longrun._names.should.be.eql(["a"]);
  })

  describe("get_state", function(){
    it("correctly invokes commands and gets output", sinon.test(function () {
      var longrun = new LongRun()
      longrun._invoke = function(commands){return JSON.stringify({"status": commands[1], "msg": commands[1]})}

      var collect_done = []
      var done = function(name, msg) {
        collect_done.push(msg)
      }


      var fail = done;
      var poll = done;
      var die = done;

      longrun.register('success', done, never_run, never_run);
      longrun.register('failure', never_run, fail, never_run);
      longrun.register('running', never_run, never_run, poll);
      longrun.register('killed', never_run, die, never_run);

      longrun._invoke = function (commands) {
	// override _invoke for testing
	return JSON.stringify({"status": commands[1], "msg": commands[1]})
      }

      longrun.get_state()
      //collect_done.should.be.eql(['success', 'failure', 'running', 'killed'])
      collect_done.should.be.eql(['success', 'failure', 'killed'])
    }))
  })

  describe("_poll", function(){
    it("polls repeatedly", function(){
      var longrun = new LongRun()
      var i = 0
      var stub_invoke = function(msg){
        i++;
        console.log("Stub_invoke "+i)
        if (i>4) {
            this.should.not.be.ok
        } else if (i==4) {
            return '{"status":"success", "msg":"ok"}'
        } else {
            return '{"status":"running", "msg":"chug"}'
        }
      }
      longrun._invoke = stub_invoke;
      var collect_done = []
      var done = function(name, msg) {
          name.should.be.eql("attempt")
          msg.should.be.eql("ok")
          window.alert("ok")
      }

      var fail = done;
      var success = done;
      
      longrun.register("attempt", success, fail, fail)
      longrun.get_state()
      
    })
  })
})
