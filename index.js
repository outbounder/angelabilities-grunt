var path = require("path")
var fs = require("fs")
var nopt = require('nopt')
var gruntOptionList = require("./grunt-option-list")

var extractGruntRunTasksAndOptions = function(input) {
  var result = {}
  var parsed = nopt(gruntOptionList.known, gruntOptionList.aliases, input, 0);
  result.tasks = parsed.argv.remain;
  result.options = parsed;
  return result
}

module.exports = function(angel, done) {

  angel.grunt = require("grunt")

  angel.on(/grunt (.*)/, function(angel){
    var result = extractGruntRunTasksAndOptions(angel.cmdData[1].split(" "))
    angel.grunt.tasks(result.tasks, result.options)
  })
  .example("$ angel grunt <task ?>")

  var packagejson = path.join(process.cwd(), "package.json")

  fs.readFile(packagejson, function(err, content){
    if(err) return console.warn("package.json not found, can't load grunt tasks")
    try {
      var json = JSON.parse(content)
      // hack to avoid loading a Gruntfile
      // You can skip this and just use a Gruntfile instead
      angel.grunt.task.init = function() {};

      // Init config
      angel.grunt.initConfig(angel.dna.grunt || {});

      // Load tasks from npm
      for(var key in json.devDependencies) {
        if(key.indexOf("grunt-") == 0) {
          angel.grunt.loadNpmTasks(key)
        }
      }
      done()
    } catch(err){
      console.error("failed to parse package.json", err)
    }
  })
}