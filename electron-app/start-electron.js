const electron = require("electron")
const proc = require("child_process")
const child = proc.spawn(electron, ["."]) // eslint-disable-line
