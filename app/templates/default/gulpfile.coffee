gulp = require 'gulp'
gulpFilter = require 'gulp-filter'
p = require('gulp-load-plugins')() # loading gulp plugins lazily
bowerFiles = require 'main-bower-files'
nib = require 'nib'
spawn = require('child_process').spawn
_ = require 'lodash'
node = null

gulp.task 'coffee', ->
  noBowerFilter = gulpFilter ['!bower_components/**/*']
  gulp
  .src ['frontend/**/*.coffee']
  .pipe noBowerFilter
  .pipe p.changed './.tmp', extension:'.js'
  .pipe p.coffee(bare:true).on 'error', (err)->p.util.log err;@emit 'end'
  .pipe gulp.dest './.tmp'

gulp.task 'stylus', ->
  gulp
  .src ['frontend/styles/**/*.styl']
  .pipe p.changed './.tmp'
  .pipe p.stylus(use:[nib()]).on 'error', (err)->p.util.log "Stylus Error:\n#{err.message}";@emit 'end'
  .pipe gulp.dest './.tmp/styles'

gulp.task 'spawn', ->
  node.kill() if node
  node = spawn 'node', ['server.js'], stdio:'inherit'
  node.on 'close', (code) ->
    if code is 8
      p.util.log 'Error! Wating for changes'

gulp.task 'livereload-start', ->
  p.livereload.listen()

gulp.task 'watch-server', ['livereload-start'], ->
  gulp.watch ['server.coffee','backend/**/*.coffee'], ['spawn']
  .on 'change', (file) ->
    p.livereload.changed file.path

gulp.task 'watch', ['livereload-start'], ->
  gulp.watch ['frontend/**/*.coffee'], ['coffee']
  gulp.watch ['frontend/styles/**/*.styl'], ['stylus']
  gulp.watch ['frontend/**/*.jade', '.tmp/**/*']
  .on 'change', (file) ->
    p.livereload.changed file.path

gulp.task 'inject-bower', ->
  gulp.src bowerFiles()
  .pipe p.inject 'frontend/index.jade',
    starttag:'//---inject:bower:{{ext}}---'
    endtag:'//---inject---'
    transform: (filepath, file, index, length) ->
      filepath = filepath.replace /^.+?\//, '' #removes frontend/, .tmp/
      ext = filepath.split('.').pop()
      switch ext
        when 'css'
          "link(rel='stylesheet' href='#{filepath}')"
        when 'js'
          "script(src='#{filepath}')"
  .pipe gulp.dest 'frontend'

gulp.task 'inject-scripts', ['coffee', 'stylus'], ->
  gulp.src ['./.tmp/**/*'], read:false
  .pipe p.inject 'frontend/index.jade',
    starttag:'//---inject:{{ext}}---'
    endtag:'//---inject---'
    transform: (filepath, file, index, length) ->
      filepath = filepath.replace /^.+?\//, '' #removes frontend/, .tmp/
      ext = filepath.split('.').pop()
      switch ext
        when 'css'
          "link(rel='stylesheet' href='#{filepath}')"
        when 'js'
          "script(src='#{filepath}')"
  .pipe gulp.dest 'frontend'

gulp.task 'start-selenium', ->
  spawn 'node_modules/selenium-server/bin/selenium', [], stdio:'inherit'

executeBrowserTest = (testName) ->
  process.env.DRYWALL_TEST_BROWSER = testName;
  spawn './node_modules/.bin/cucumber.js', ['--format', 'summary', '--coffee', '-b'], stdio:'inherit'

browsers = ['phantomjs', 'chrome', 'firefox'];

_.each browsers, (testName) ->
  gulp.task "test_#{testName}", (cb) ->
    executeBrowserTest(testName)

gulp.task 'serve', ['inject-bower', 'inject-scripts', 'spawn', 'watch', 'watch-server', 'start-selenium'], ->

gulp.task 'default', ['serve']
