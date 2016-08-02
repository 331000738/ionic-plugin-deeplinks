/**
 Hook is executed at the end of the 'prepare' stage. Usually, when you call 'cordova build'.
 It will inject required preferences in the platform-specific projects, based on <universal-links>
 data you have specified in the projects config.xml file.
 */

var configParser = require('./lib/configXmlParser.js');
var iosProjectEntitlements = require('./lib/ios/projectEntitlements.js');
var iosProjectPreferences = require('./lib/ios/xcodePreferences.js');
var IOS = 'ios';

module.exports = function(ctx) {
    run(ctx);
};

/**
 * Execute hook.
 *
 * @param {Object} cordovaContext - cordova context object
 */
function run(cordovaContext) {
    var deeplinkHost = configParser.getDeeplinkHost(cordovaContext);
    var platformsList = cordovaContext.opts.platforms;

    // if no host is defined - exit
    if (deeplinkHost === null) {
        console.warn('No host is specified in the config.xml. Ionic Deeplinks Plugin is not going to work.');
        return;
    }

    platformsList.forEach(function(platform) {
        if (platform === IOS) {
            activateUniversalLinksInIos(cordovaContext, deeplinkHost);
        }
    });
}

/**
 * Activate Universal Links for iOS application.
 *
 * @param {Object} cordovaContext - cordova context object
 * @param {String} deeplinkHost - The deeplink host
 */
function activateUniversalLinksInIos(cordovaContext, deeplinkHost) {
    // modify xcode project preferences
    iosProjectPreferences.enableAssociativeDomainsCapability(cordovaContext);

    // generate entitlements file
    iosProjectEntitlements.generateAssociatedDomainsEntitlements(cordovaContext, deeplinkHost);
}
