# angelabilities-grunt

A quick 'hack' for giving organic-angel grunt abilities. It is based on grunt 0.4 and autoloads all grunt modules found in node_modules. No Gruntfile is required.

## setup

    $ cd myProject
    $ npm install angelabilities-grunt

### optionally use `Gruntfile.js`

    $ cd myProject
    $ echo "Gruntfile.js" >> ./dna/gruntfile.json
    $ vim Gruntfile.js

### optionally use grunt configuration

    $ cd myProject
    $ echo "{... gruntConfiguration ...}" >> ./dna/grunt.json

## use

    $ cd myProject
    $ angel grunt -h 
    $ angel grunt <grunt task>

### add your own local grunt tasks without Gruntfile.js

    $ vim scripts/grunt/myTask.js