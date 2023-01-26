import * as core from "@actions/core"
// const core = require('@actions/core');
const github = require('@actions/github');
const fs = require("fs")

// try {
//   // `who-to-greet` input defined in action metadata file
//   const nameToGreet = core.getInput('who-to-greet');
//   console.log(`Hello ${nameToGreet}!`);
//   const time = (new Date()).toTimeString();
//   core.setOutput("time", time);
//   // Get the JSON webhook payload for the event that triggered the workflow
//   const payload = JSON.stringify(github.context.payload, undefined, 2)
//   console.log(`The event payload: ${payload}`);
// } catch (error) {
//   core.setFailed(error.message);
// }

const files = ["./docker-compose.yml", "./Server/Dockerfile", "./Application/Dockerfile", "./Web/Dockerfile"]
const result = []

for (var i in files) {
    if (fs.existsSync("../" + i) == true) {
        result.push("PASS")
    } else {
        result.push("FAIL")
    }
}

const testFolder = "."
var r = []

fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
      r.push(file)
    });
  });
await core.summary
  .addHeading('Test Results')
  .addTable([
    [{data: 'File', header: true}, ].concat(files),
    [{data: 'Result', header: true}].concat(result)
  ]).addRaw(r)
  .write()