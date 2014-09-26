util = require('util')
path = require('path')
yeoman = require('yeoman-generator')
chalk = require('chalk')
spawn = require('child_process').spawn

GarlicWebappGenerator = yeoman.generators.Base.extend
  init: ->
    # read the local package file
    @pkg = yeoman.file.readJSON path.join __dirname, '../package.json'
    @config.set
      appName: @appname
      css: ['bootstrap'],
      scaffolds:[''],
    # have Yeoman greet the user
    console.log @yeoman
    # replace it with a short and sweet description of your generator
    console.log chalk.magenta 'You\'re using the GarlicTech webapp generator.'

  saveConfig: ->
    @config.save()

  scaffoldFolders: ->
    @mkdir("./frontend")
    @mkdir("./frontend/modules")
    @mkdir("./frontend/resources")
    @mkdir("./frontend/styles")
    @mkdir("./backend/config")
    @mkdir("./backend/config/env")
    @mkdir("./backend/modules")
    @mkdir("./features")
    @mkdir("./features/step_definitions")
    @mkdir("./features/support")
    @mkdir("./logs")

  copyMainFiles: ->
    @config = @config.getAll();
    @directory("./default", "./")

  runNpm: ->
    if 'skip-install' not in @options
      done = @async()
      console.log("\nRunning NPM Install. Bower is next.\n")
      seleniumLogdir = path.join(@destinationRoot(), 'node_modules', 'selenium-server', 'logs')
      seleniumLogdirLink = path.join(@destinationRoot(), 'logs', 'selenium')

      @npmInstall "", =>
        spawn 'ln', ['-sf', seleniumLogdir, seleniumLogdirLink], stdio:'inherit'
        done();

  runBower: ->
    if 'skip-install' not in @options
      done = @async()
      console.log("\nRunning Bower:\n")
      @bowerInstall "", ->
        console.log("\nAll set! Type: gulp serve\n")
        done()

module.exports = GarlicWebappGenerator
