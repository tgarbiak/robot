#! /usr/bin/env node
"use strict";
const bb = require('bluebird');
const proc = require('process');
let app = require('./app.js');
let search = require('./search.js');

app.question('Provide number of towers')
    .then(app.handleEmittersCountResponse)
    .then(function() { return app.question('Provide start point location (in an "x y" format)'); })
    .then(app.handleStartEndPoint('startPoint'))
    .then(function() { return app.question('Provide end point location (in an "x y" format)'); })
    .then(app.handleStartEndPoint('endPoint'))
    .then(function() {
        if (search(app.state)) {
            proc.stdout.write('Path between start point and end point was found');
        } else {
            proc.stdout.write('No path between start and end point found');
        }
    })
    .catch(function(error) {
        console.log(error.trace());
        proc.exit();
    });


