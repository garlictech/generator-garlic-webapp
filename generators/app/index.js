var GarlicWebappGenerator, _, chalk, path, util, yeoman;

util = require('util');

path = require('path');

yeoman = require('yeoman-generator');

chalk = require('chalk');

_ = require('lodash');

GarlicWebappGenerator = yeoman.generators.Base.extend({
  initializing: {
    init: function() {
      this.config.set({
        appName: this.appname,
        angularModules: {
          ui: [],
          services: [],
          factories: [],
          pages: []
        },
        backend: {
          components: []
        },
        common: {
          components: []
        }
      });
      return console.log(chalk.magenta('You\'re using the GarlicTech webapp generator.'));
    }
  },
  writing: {
    mainFiles: function() {
      this.conf = this.config.getAll();
      this.fs.copyTpl(this.templatePath('default/**/*'), this.destinationPath("./"), {
        appName: _.kebabCase(this.conf.appName),
        appNameCC: _.capitalize(_.camelCase(this.conf.appName)),
        appNameAsIs: this.conf.appName
      });
      return this.fs.copy(this.templatePath('default_assets/**/*'), this.destinationPath("./frontend/src/"));
    },
    "frontend/ui-modules.coffee": function() {
      var dest;
      dest = this.destinationPath("./frontend/src/ui-modules.coffee");
      if (!this.fs.exists(dest)) {
        return this.fs.write(dest, "Module = angular.module \"" + this.conf.appName + "-ui\", []\nmodule.exports = Module.name");
      }
    },
    "frontend/service-modules.coffee": function() {
      var dest;
      dest = this.destinationPath("./frontend/src/service-modules.coffee");
      if (!this.fs.exists(dest)) {
        return this.fs.write(dest, "Module = angular.module \"" + this.conf.appName + "-services\", []\nmodule.exports = Module.name");
      }
    },
    "frontend/factory-modules.coffee": function() {
      var dest;
      dest = this.destinationPath("./frontend/src/factory-modules.coffee");
      if (!this.fs.exists(dest)) {
        return this.fs.write(dest, "Module = angular.module \"" + this.conf.appName + "-factories\", []\nmodule.exports = Module.name");
      }
    },
    "frontend/views/test-page/test-page-components.jade": function() {
      var dest;
      dest = this.destinationPath("./frontend/src/views/test-page/test-page-components.jade");
      if (!this.fs.exists(dest)) {
        return this.fs.write(dest, "");
      }
    },
    dotfiles: function() {
      return this.fs.copy(this.templatePath('default/.*'), this.destinationPath("./"));
    }
  },
  install: {
    dependencies: function() {
      var cb;
      cb = this.async();
      console.log("\nLinking gt-complib.\n");
      this.spawnCommand('npm', ['link', 'gt-complib']);
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
      return cb();
    }
  }
});

module.exports = GarlicWebappGenerator;
