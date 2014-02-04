# !/bin/bash
# Test longrun.state

rm -rf ~/.longrun
mkdir ~/.longrun
~/longrun/bin/launcher SUCCESS __NOPE__SUCCESS echo "ok"
~/longrun/bin/launcher FAILED __NOPE__FAILED false
~/longrun/bin/launcher RUNNING __NOPE__RUNNING sleep 10 &
~/longrun/bin/launcher KILLED __NOPE__KILLED sleep 10 &
pkill -9 -f __NOPE__KILLED

if [ "$(~/longrun/bin/longrun.state SUCCESS)" != "success" ]
then
  echo success error
fi

if [ "$(~/longrun/bin/longrun.state FAILED)" != "failure" ]
then
  echo fail error
fi

if [ "$(~/longrun/bin/longrun.state RUNNING)" != "running" ]
then
  echo run error
fi

if [ "$(~/longrun/bin/longrun.state KILLED)" != "killed" ]
then
  echo kill error
fi

if [ "$(~/longrun/bin/longrun.state NOTRUN)" != "not run" ]
then
  echo notrun error
fi

##########################

if ~/longrun/bin/longrun.start RUNNING sleep 10 > /dev/null
then
  echo start running error
fi

if ! ~/longrun/bin/longrun.start NOTRUN true > /dev/null
then
  echo start notrun error
fi


