"use strict";

const proc = require('process');
const bb = require('bluebird');
const rl = require('readline');

let app = {};

app.state = {
    emitters: [],
    emittersCount: 0,
    startPoint: null,
    endPoint: null,
    doable: null
};

let prompts = rl.createInterface({
    input: proc.stdin,
    output: proc.stdout
});

app.question = bb.promisify(function(question, callback) {
    prompts.question(question + '\n> ', callback.bind(null, null));
});

app.handleEmittersCountResponse = function (response) {
    app.state.emittersCount = parseInt(response, 10);
    if (isNaN(app.state.emittersCount) || app.state.emittersCount <= 0) {
        return app.question('Number of towers must be greater than 0').then(app.handleEmittersCountResponse);
    }
    return app.question('Provide location of the 1st tower (in an "x y range" format):').then(app.handleEmitterSpecResponse);
};

app.handleEmitterSpecResponse = function (response) {
    let emitterArr = response.split(' ');
    app.state.emitters.push({
        x: emitterArr[0],
        y: emitterArr[1],
        z: emitterArr[2]
    });
    if (--app.state.emittersCount > 0) {
        return app.question('Provide location of the next tower (in an "x y range" format):')
            .then(app.handleEmitterSpecResponse);
    }
};

app.handleStartEndPoint = function(type) {
    return function(response) {
        let point = response.split(' ');
        app.state[type] = { x: point[0], y: point[1] };
    }
};

module.exports = app;