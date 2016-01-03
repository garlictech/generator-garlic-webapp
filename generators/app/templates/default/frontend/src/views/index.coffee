config = require '../config'

Module = angular.module "#{config.MainModuleName}.views", [
  require 'angular-ui-router'
  require './front-page'
  require './test-page'
]
.config ['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) ->

  $urlRouterProvider.otherwise "/"

  $stateProvider
  .state 'index',
    url: '/'
    views:
      'header':
        template: '<div <%= appName %>-main-header></div>'
      'main':
        template: '<div <%= appName %>-front-page></div>'

  .state 'test',
    url: '/test'
    views:
      'main':
        template: '<div <%= appName %>-test-page></div>'
]

module.exports = Module.name
