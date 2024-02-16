# GIT HOW-TOs

TLDR WORKFLOW
- git status (optional)
- git pull origin master
- git add .
- git commit -m "insert message"
- git push origin master

STARTING
- download zip file of newest code from master branch (if you need the other person's files) OR
- git pull origin master
- make local edits

COMMITTING TO OWN BRANCH
- git status (optional)
- git branch (optional)
- git checkout (optional)
- git add . (optional)
- git add filename.java
- git commit -m "insert message"

PUSH OWN BRANCH EDITS TO MEGAN BRANCH IN GITHUB
- git remote -v (optional)
- git log (optional)
- [git pull origin megan]
- git push origin megan

COMMITTING TO MASTER BRANCH
- git checkout master
- [git checkout master -- filename.java]
- git status
- git add filename.java
- git commit -m "insert message"
- [git pull origin master]
- git push origin master

AFTERWARDS
- edit the readme on github
