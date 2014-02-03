JS testing:
Framework: http://visionmedia.github.io/mocha/
Nice assertions: https://github.com/visionmedia/should.js/
Stubbing and mocking: http://sinonjs.org/


Features:
Essential:
* Runs commands
* Dead easy to invoke.
* Allows multiple programs to save logs/state separately
* Has decent logs - stderr/stdout + commands run
* Polls
* If I close the browser and come back, the tool is in the same state as if I’d left the browser window open.

Nice:
* Configurable polling sleep / exponential backoff?
* Tracks running/succeeded/failed/unexpectedly died status of programs
* gives meaningful output when polling (not just ‘it’s still there’)
* JSON output from server side
* Stop command
* Don’t run if already running same ‘named’ command
* Detects if program died unexpectedly w/o error code (or with error code)


~/.longrun

On loading page:
* scraperwiki.longrun.get_state()
- get list of commands (in run order) from server
- needs lookup of success/failure/poll functions per command - Javascript dictionaries in code.js?
- may need to run success function of commands. 

scraperwiki.longrun.register(name, success, failure, poll) ← order might be important
- pure javascript function for allowing get_state to work. Just sets up data structures.

scraperwiki.longrun.get_state()  // get all states, run appropriate functions
- for each registered function, check status [via ~/.longrun api + ps aux?]
    * if success, call success function
    * if fail, call failure function
    * if died unexpectedly, call failure function differently somehow?
    * if running, set up polling
    * if not started, do nothing.
Backend: 
   if process running:
      return running
   else:
      if ~/.longrun/name.status
        return it
      else:
        return omg_died!

Call the functions *in turn*, i.e. not async: some may change settings.

scraperwiki.longrun._poll(name)
- check named function’s status, call appropriate function (incl. _poll on timeout)

scraperwiki.longrun.start(cmd, name) ← fails if already running?
- nukes ~/.longrun/name.*
- invoke command (~/bin/longrun -> ~/bin/longrun_helper?)
- logs to ~/.longrun/name.log
- when command ends, updates ~/.longrun/name.status

scraperwiki.longrun.stop(cmd, name) 
Steal code from enrunify? Or record PID?
???

