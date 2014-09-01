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
  .example("$ angel grunt -h")

  var node_modules = path.join(process.cwd(), "node_modules")
  var local_grunt_scripts = path.join(process.cwd(), "scripts", "grunt")

  fs.readdir(node_modules, function(err, results){
    if(err) return console.warn(err, " error found during node_modules scanning, can't load grunt tasks")
    try {
      // either use Gruntfile or 'hack' it.
      if(angel.dna.gruntfile)
        angel.grunt.task.init = require(path.join(process.cwd(), angel.dna.gruntfile))
      else
        angel.grunt.task.init = function() {};

      // Init config
      angel.grunt.initConfig(angel.dna.grunt || {});

      // Load tasks
      results.forEach(function(r){
        if(r.indexOf("grunt-") == 0)
          angel.grunt.loadNpmTasks(r)
      })

      angel.grunt.loadTasks(local_grunt_scripts)

      done()
    } catch(err){
      console.error("failed to initialize angel grunt ability", err)
    }
  })
}