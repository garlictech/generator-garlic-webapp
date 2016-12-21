var GarlicWebappGenerator, _, chalk, execute, generatorLib, jsonfile, path, util, yeoman;

util = require('util');

path = require('path');

yeoman = require('yeoman-generator');

chalk = require('chalk');

_ = require('lodash');

jsonfile = require('jsonfile');

execute = require('child_process').execSync;

generatorLib = require('../lib');

GarlicWebappGenerator = yeoman.generators.Base.extend({
  initializing: function() {
    this.config.set({
      appname: this.appname,
      angularModules: {
        directives: [],
        services: [],
        components: []
      }
    });
    return console.log(chalk.magenta('You\'re using the GarlicTech angular 2 app generator.'));
  },
  prompting: function() {
    var cb, done;
    done = this.async();
    cb = (function(_this) {
      return function(answers) {
        _this.answers = answers;
        _this.config.set({
          scope: _this.answers.scope
        });
        _this.config.set({
          projectType: _this.answers.projectType
        });
        return done();
      };
    })(this);
    return this.prompt([
      {
        type: 'input',
        name: 'scope',
        "default": 'garlictech',
        message: 'Project scope (company github team):',
        store: true
      }, {
        type: 'list',
        name: 'projectType',
        "default": 'module',
        choices: ['module', 'site'],
        message: 'Project type:',
        store: true
      }, {
        type: 'input',
        name: 'dockerRepo',
        "default": 'docker.io',
        message: 'Docker repo:',
        store: true
      }, {
        type: 'confirm',
        name: 'isRepo',
        "default": true,
        message: 'Create github repo?',
        store: true
      }, {
        type: 'confirm',
        name: 'isTravis',
        "default": true,
        message: 'Configure travis.ci?',
        store: true
      }
    ], cb.bind(this));
  },
  writing: {
    createConfig: function() {
      var angularModuleName, appname, match;
      generatorLib.createConfig.bind(this)();
      match = /(.*) angular/.exec(this.appname);
      appname = match ? match[1] : this.appname;
      angularModuleName = this.conf.scopeCC + "." + (_.upperFirst(_.camelCase(appname)));
      this.conf.angularModuleName = angularModuleName;
      this.conf.dockerRepo = this.answers.dockerRepo;
      return this.config.set({
        angularModuleName: angularModuleName,
        scope: this.answers.scope
      });
    },
    mainFiles: function() {
      var cb;
      cb = this.async();
      this.fs.copyTpl(this.templatePath('default/**/*'), this.destinationPath("./"), {
        conf: this.conf
      });
      this.fs.copyTpl(this.templatePath('dotfiles/_package.json'), this.destinationPath("./package.json"), {
        conf: this.conf
      });
      this.fs.copyTpl(this.templatePath('dotfiles/_npmignore'), this.destinationPath("./.npmignore"), {
        conf: this.conf
      });
      this.fs.copyTpl(this.templatePath('dotfiles/_gitignore'), this.destinationPath("./.gitignore"), {
        conf: this.conf
      });
      if (this.conf.projectType === 'site') {
        this.fs.copy(this.templatePath('default_assets/**/*'), this.destinationPath("./src/"));
      }
      return cb();
    },
    projectTypeFiles: function() {
      if (this.conf.projectType === 'module') {
        return this.fs.copyTpl(this.templatePath('module/**/*'), this.destinationPath("./"), {
          conf: this.conf
        });
      } else {
        return this.fs.copyTpl(this.templatePath('site/**/*'), this.destinationPath("./"), {
          conf: this.conf
        });
      }
    },
    dotfiles: function() {
      return this.fs.copy(this.templatePath('default/.*'), this.destinationPath("./"));
    }
  },
  end: {
    docker: function() {
      var cb;
      cb = this.async();
      this.composeWith('garlic-webapp:angular-docker', {
        options: {
          answers: this.answers
        }
      });
      return cb();
    },
    repo: function() {
      var cb;
      if (this.answers.isRepo) {
        cb = this.async();
        this.composeWith('garlic-webapp:github', {
          options: {
            answers: this.answers
          }
        });
        return cb();
      }
    },
    travis: function() {
      var cb;
      if (this.answers.isTravis) {
        if (!this.answers.isRepo) {
          console.log(chalk.yellow('WARNING: You disabled github repo creation. If the repo does not exist, the Travis commands will fail!'));
        }
        cb = this.async();
        this.composeWith('garlic-webapp:travis', {
          options: {
            answers: this.answers
          }
        });
        return cb();
      }
    },
    travisLocal: function() {
      var cb;
      if (this.answers.isTravis) {
        cb = this.async();
        this.fs.copyTpl(this.templatePath('travis/**/*'), this.destinationPath("./"), {
          c: this.conf
        });
        return cb();
      }
    }
  }
});

module.exports = GarlicWebappGenerator;
