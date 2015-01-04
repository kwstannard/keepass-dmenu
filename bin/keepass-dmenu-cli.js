#!/usr/bin/env node
var argv = require('yargs')
    .usage('Usage: $0 --database path/to/db.kbdx')
    .demand(['database'])
    .argv;
var async = require('async');

var config = {
    passwordCacheFile: '/tmp/keepass-dmenu.cache',
    passwordCacheReaperPid: '/tmp/keepass-dmenu.reaper-pid',
    databasePath: require('path').resolve(process.cwd(), argv.database),
    cachePassword: argv['cache-password'] || false,
    password: argv.password || null,
    clearClipboard: 10000
};

if (typeof argv['clear-clipboard'] === 'number') {
    if (argv['clear-clipboard'] === 0) {
        config.clearClipboard = false;
    } else {
        config.clearClipboard = argv['clear-clipboard'] * 1000; // convert seconds to ms
    }
} else if (argv['clear-clipboard'] !== undefined) {
    console.log('Invalid value for flag --clear-clipboard, must be a number.');
    process.exit(1);
}

async.waterfall([
    require('../lib/getPassword')(config),
    require('../lib/createPassword')(config),
    require('../lib/loadDatabase')(config),
    // Present choice for entries
    function (entries, callback) {
        require('../lib/dmenuFilter')(entries.map(function (entry) {
            return entry.title;
        }), function (err, choice) {
            if (err) {
                return callback(err);
            }

            var result = entries.filter(function (entry) {
                return entry.title === choice;
            });

            if (result.length === 1) {
                return callback(null, result[0]);
            } else if (result.length === 0) {
                return callback(new Error('no matching results'));
            } else {
                return callback(new Error('too many matching results'));
            }
        });
    },
    // Present choice for labels
    function (matched, callback) {
        if (config.label) {
            if (matched[argv.label]) {
                callback(null, matched[argv.label]);
            } else {
                return callback(new Error('no matching results'));
            }
        } else {
            require('../lib/dmenuFilter')(Object.keys(matched), function (err, choice) {
                if (err) {
                    return callback(err);
                }

                if (matched[choice]) {
                    return callback(null, matched[choice]);
                } else {
                    return callback(new Error('no matching results'));
                }
            });
        }
    },
    // Put requested property on the clipboard
    function (matched, callback) {
        require('../lib/copyToClipboard')(matched, function (err) {
            if (err) {
                return callback(err);
            }

            console.log('put requested property on clipboard');
            callback();
        });
    },
    // Clear the clipboard
    function (callback) {
        if (config.clearClipboard) {
            setTimeout(function () {
                require('../lib/copyToClipboard')('', function (err) {
                    if (err) {
                        return callback(err);
                    }

                    console.log('cleared clipboard after 5 seconds');
                    callback();
                });
            }, config.clearClipboard);
        } else {
            callback();
        }
    }
], function (err) {
    if (err) {
        console.log('Error: ', err);
        process.exit(1);
    }
    console.log('Done!');
});