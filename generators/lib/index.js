var Methods, _, execute;

_ = require('lodash');

execute = require('child_process').execSync;

Methods = {
  createConfig: function() {
    var appNameAsIs, appNameFQ, appNameFQcC, appNameKC, conf, scopeCC;
    conf = this.config.getAll();
    scopeCC = _.capitalize(_.camelCase(conf.scope));
    appNameAsIs = scopeCC + " " + conf.appname;
    appNameKC = _.kebabCase(conf.appname);
    appNameFQ = _.kebabCase(appNameAsIs);
    appNameFQcC = _.camelCase(appNameFQ);
    return this.conf = _.assign(conf, {
      scope: conf.scope,
      scopeCC: scopeCC,
      appNameKC: appNameKC,
      appNameAsIs: appNameAsIs,
      appNameFQ: appNameFQ,
      appNameFQcC: appNameFQcC,
      appNameFQCC: _.capitalize(appNameFQcC),
      npmToken: process.env["NPM_TOKEN_" + scopeCC],
      slackToken: process.env["SLACK_TOKEN_" + scopeCC]
    });
  },
  createDirectiveConfig: function() {
    Methods.createConfig.bind(this)();
    if (this.options.view) {
      this.answers = this.options.answers;
    }
    this.conf.componentNameCC = _.capitalize(_.camelCase(this.answers.name));
    this.conf.moduleName = this.conf.angularModuleName + "." + this.conf.componentNameCC;
    this.conf.directiveNameCC = "" + this.conf.appNameFQcC + this.conf.componentNameCC;
    this.conf.directiveNameKC = this.conf.appNameFQ + "-" + this.answers.name;
    if (this.options.view) {
      this.conf.moduleName = this.conf.moduleName + ".View";
      this.conf.directiveNameCC = this.conf.directiveNameCC + "View";
      this.conf.directiveNameKC = this.conf.directiveNameKC + "-view";
      this.moduleNames = this.conf.angularModules.views;
    } else {
      this.moduleNames = this.conf.angularModules.directives;
    }
    return this.moduleNames.push(this.answers.name);
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
        return done();
      };
    })(this);
    return this.prompt([
      {
        type: 'input',
        name: 'scope',
        "default": 'garlictech',
        message: 'Project scope (company github team):'
      }
    ], cb.bind(this));
  },
  dependencies: function() {
    var cb;
    cb = this.async();
    if (!this.options['skip-install']) {
      this.installDependencies();
    }
    return cb();
  },
  execute: function(command) {
    return execute(command, {
      stdio: [0, 1, 2]
    });
  }
};

module.exports = Methods;