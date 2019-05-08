#!/usr/bin/env bash

export TASKEVO_SOCKET="/Applications/MAMP/tmp/mysql/mysql.sock"
export TASKEVO_DB_HOST="localhost"
export TASKEVO_DB_USER="taskevo"
export TASKEVO_DB_PASS="taskevo"
export TASKEVO_DB_NAME="taskevo"

./bin/taskevo-api --port=3580
