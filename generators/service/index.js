var GarlicWebappUiGenerator, _, chalk, fs, path, spawn, util, yeoman;

util = require('util');

path = require('path');

yeoman = require('yeoman-generator');

chalk = require('chalk');

spawn = require('child_process').spawn;

_ = require('lodash');

fs = require('fs');

GarlicWebappUiGenerator = yeoman.generators.Base.extend({
  initializing: {
    init: function() {
      this.config.set({
        appName: this.appname
      });
      return console.log(chalk.magenta('You\'re using the GarlicTech webapp service generator.'));
    }
  },
  prompting: function() {
    var cb, done;
    done = this.async();
    cb = (function(_this) {
      return function(answers) {
        done();
        return _this.answers = answers;
      };
    })(this);
    return this.prompt({
      type: 'input',
      name: 'name',
      message: 'Module name (like foo-service): ',
      required: true
    }, cb.bind(this));
  },
  writing: {
    mainFiles: function() {
      var appName, serviceName;
      this.config = this.config.getAll();
      appName = _.capitalize(_.camelCase(this.config.appName));
      serviceName = _.capitalize(_.camelCase(this.answers.name));
      return this.fs.copyTpl(this.templatePath('default/**/*'), this.destinationPath("./frontend/src/" + this.answers.name), {
        moduleName: this.answers.name,
        serviceName: serviceName,
        serviceNameFQ: "" + appName + serviceName
      });
    },
    "frontend/components.json": function() {
      var dest;
      dest = this.destinationPath("./frontend/src/components.json");
      this.moduleNamesObj = this.fs.readJSON(dest);
      this.moduleNamesObj.serviceModuleNames.push(this.answers.name);
      return this.fs.writeJSON(dest, this.moduleNamesObj);
    },
    "service-modules.coffee": function() {
      var content, dest;
      dest = this.destinationPath("./frontend/src/service-modules.coffee");
      content = "Module = angular.module \"" + this.config.appName + "-services\", [";
      _.forEach(this.moduleNamesObj.serviceModuleNames, function(moduleName) {
        return content += "\n  require './" + moduleName + "'";
      });
      content += "\n]\n\nmodule.exports = Module.name";
      return this.fs.write(dest, content);
    }
  }
});

module.exports = GarlicWebappUiGenerator;