util = require('util')
path = require('path')
yeoman = require('yeoman-generator')
chalk = require('chalk')
spawn = require('child_process').spawn
_ = require 'lodash'
fs = require 'fs'
path = require 'path'
generatorLib = require '../lib'

GarlicWebappNg2ServiceGenerator = yeoman.generators.Base.extend
  initializing:
    init: ->
      @conf = @config.getAll()
      console.log chalk.magenta 'You\'re using the GarlicTech webapp Angular 2 service generator.'


  prompting: ->
    done = @async()
    cb = (answers) =>
      @answers = answers
      done()

    @prompt [{
      type    : 'input'
      name    : 'baseFolder'
      default : 'src/app'
      message : 'Base folder relative to the app root (like src/app): '
      required: true
      store   : true
    }, {
      type    : 'input'
      name    : 'name'
      message : 'Service name without Service part (like foo-bar): '
      required: true
    }], cb.bind @


  writing:
    createConfig: ->
      @conf = _.assign @conf, generatorLib.createConfig.bind(@)()
      @conf.serviceName = _.upperFirst _.camelCase "#{@answers.name}-service"


    mainFiles: ->
      @fs.copyTpl @templatePath('default/**/*'), @destinationPath("./#{@answers.baseFolder}/#{@answers.name}-service"), {c: @conf}

module.exports = GarlicWebappNg2ServiceGenerator
