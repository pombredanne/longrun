var never_run = function(msg) {
  console.log("never_run: "+msg)
  "running never_run".should.not.be.ok;  // you should never run this function
}

describe("Longrun", function(){
  LongRun.should.be.ok;

  it("runs end to end", function(done){
    this.timeout(5001);
    var longrun = new LongRun();
    var succ=function(name, msg){
      console.log("SUCCESS\n"+name+"\n"+msg+"!!");
      done()
    };
    var poller = function(name, msg){longrun._poll(name, msg)}
    longrun.register("endtoend",succ, null, poller);
    longrun.start("endtoend", "sleep 1");
    longrun.get_one_state("endtoend");
    // TODO spy

  })

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
      collect_done.should.be.eql(['success', 'failure', 'running', 'killed'])
    }))
  })

  describe("_poll", function(){
    it("polls repeatedly", function(){
      var longrun = new LongRun()
      var i = 0
      var stub_invoke = function(msg){
        i++;
        console.log("Stub_invoke "+i+msg)
        if (i>4) {
            "running many times".should.not.be.ok
        } else if (i===4) {
            return '{"status":"success", "msg":"ok"}'
        } else {
            return '{"status":"running", "msg":"chug"}'
        }
      }
      longrun._invoke = stub_invoke;
      var bond = sinon.spy();
      var fail = function() {
         "calling fail".should.not.be.ok;
      }   
      this.clock = sinon.useFakeTimers();
 
      var poller = function(name, msg){longrun._poll(name, msg)}
      longrun.register("attempt", bond, fail, poller);
      longrun.get_state();
      this.clock.tick(50000);
      bond.calledOnce.should.be.ok;
      bond.calledWith("attempt", "ok").should.be.ok;
    })
  })
})
