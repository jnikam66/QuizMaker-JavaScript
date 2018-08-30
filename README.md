# How to use this repo
1. Navigate to some arbitrary project directory, and use the deployd command "dpd" to create an empty project:
    * ```mkdir my-projects && cd my-projects```
    * ```dpd create quiz-maker```
2. When dpd is finished, go into the new project directory and initialize a git repo
    * ```cd quiz-maker```
    * ```git init```
3. Add the appropriate repository as a remote:
	* Pre-release developers use:
		* ```git remote add origin https://hoth.sevencode.com:3000/CPSC-473/quiz-maker.git```
	* Public consumption use:
		* ```git remote add origin https://github.com/mikeperalta1/quiz-maker.git```
4. Perform a hard reset of your local repository to point to the remote.
    * ```git fetch origin```
    * ```git branch --all```
        * (to make sure you have the remote branches)
    * ```git reset --hard origin/master```
5. At this point you should have a detached head, and can create your own local master branch
    * ```git checkout -b master```
    * ```git branch --set-upstream-to=origin/master```
6. Do the same for the development branch
    * ```git reset --hard origin/development```
    * ```git checkout -b development```
    * ```git branch --set-upstream-to=origin/development```
7. You should hopefully be all setup to develop. Instructions in this list haven't been fully tested, so let me know if you need help.

# Installing deployd
The main website's instructions seem to be outdated and installing simply "deployd" into npm won't work. Instead, do:
* ```[install npm with apt / yum / dnf]```
* ```sudo npm install --global deployd-cli```

# Launching your deployd project

## Launching manually
1. Navigate to your project directory and execute "dpd". For example per above:
	* ```cd ~/my-projects/quiz-maker```
	* ```dpd```

## Launching at boot via cron
(Useful if you're serving deployd from a headless virtual machine or something)
1. Make sure the program "screen" is installed
	* ```[sudo apt install screen, or yum install screen, or dnf, etc]```
2. Create launch script in your ~/bin directory
	* (create bin if needed) ```mkdir ~/bin```
	* Create a file "start-quiz-maker"
		* ```nano ~/bin/start-quiz-maker```
	* Fill with code from "Sample Start Script" below
3. Make sure the script is executable with
	* ```chmod +x ~/bin/start-quiz-maker```
4. Add to cron at reboot
	* ```crontab -e``` (to launch crontab editor)
	* Add the following line:
		* ```@reboot /home/your-username/bin/start-quiz-maker```
5. Hopefully deployd will start your project at boot

If you get an error about dpd not being found (despite being able to launch manually), it's possible cron needs the correct PATH variable set, so find your PATH setting with:

```echo $PATH```

Then add another line to your crontab at the top:

```PATH=[contents of path from above echo command]```

### Sample start script
```
#!/bin/bash

sleep 30; # wait to make sure network is up
screen -dmS quiz-maker bash -c 'cd /home/your-user-name/my-projects/quiz-maker && dpd -d'
```
