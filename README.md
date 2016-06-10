Ionic Deeplinks Plugin
======

This plugin makes it easy to respond to deeplinks through custom URL schemes
and Universal/App Links on iOS and Android.

For example, you can have your app open through a link to https://yoursite.com/product/cool-beans and then navigate
to display the Cool Beans in your app (cool beans!).

Additionally, on Android and pre 9.2 iOS, your app can be opened through a custom URL scheme, like `coolbeans://app/product/cool-beans`.

Since Custom URL schemes are no longer supported on iOS >= 9.2 iOS, you'll need to [configure Universal Links](#ios-configuration)

*Note: this plugin may clash with existing Custom URL Scheme and Universal Links Plugins. Please let
us know if you encounter compatibility issues. Also, try removing them and using this one on its own.*

## Installation

```bash
cordova plugin add ionic-plugin-deeplinks --variable URL_SCHEME myapp --variable DEEPLINK_SCHEME=https DEEPLINK_HOST=example.com
```

Fill in the appropriate values as shown below:

 * `URL_SCHEME` - the custom URL scheme you'd like to use for your app. This lets your app respond to links like `myapp://blah`
 * `DEEPLINK_SCHEME` - the scheme to use for universal/app links. 99% of the time you'll use `https` here as iOS and Android require SSL for app links domains.
 * `DEEPLINK_HOST` - the host that will respond to deeplinks. For example, if we want `example.com/product/cool-beans` to open in our app, we'd use `example.com` here.


## Handling Deeplinks in JavaScript

*note: make sure to call IonicDeeplink from a platform.ready or `deviceready` event*

Using [Ionic Native](https://github.com/driftyco/ionic-native) (available in 1.2.4 or greater):

```javascript
import {Deeplinks} from 'ionic-native';

Deeplinks.route({
  '/about-us': AboutPage,
  '/universal-links-test': AboutPage,
  '/products/:productId': ProductPage
}).subscribe((match) => {
  // match.$route - the route we matched, which is the matched entry from the arguments to route()
  // match.$args - the args passed in the link
  // match.$link - the full link data
  console.log('Successfully matched route', match);
}, (nomatch) => {
  // nomatch.$link - the full link data
  console.error('Got a deeplink that didn\'t match', nomatch);
});
```

If you're using Ionic 2, there is a convenience method to route automatically (see the simple [Ionic 2 Deeplinks](https://github.com/driftyco/ionic2-deeplinks-demo/blob/master/app/app.ts) demo for an example):

```javascript
Deeplinks.routeWithNavController(this.navController, {
  '/about-us': AboutPage,
  '/products/:productId': ProductPage
});

// Note: routeWithNavController also returns an observable you can also subscribe to for success/error in matching as in the first example
```

Coming soon: VanillaJS and Ionic 1/Angular 1 instructions

For Ionic 1 and Angular 1 apps using Ionic Native, there are many ways we can handle deeplinks. However,
we need to make sure we set up a history stack for the user, we can't navigate directly to our page
because Ionic 1's navigation system won't properly build the navigation stack (to show a back button, for example).

This is all fine because deeplinks should provide the user with a designed experience for what the back button
should do, as we are putting them deep into the app and need to provide a natural way back to the main flow:

```javascript
angular.module('myApp', ['ionic', 'ionic.native'])

.run(['$ionicPlatform', '$cordovaDeeplinks', '$state', '$timeout', function($ionicPlatform, $cordovaDeeplinks, $state, $timeout) {
  $ionicPlatform.ready(function() {
    // Note: route's first argument can take any kind of object as its data,
    // and will send along the matching object if the route matches the deeplink
    $cordovaDeeplinks.route({
      '/product/:productId': {
        target: 'product',
        parent: 'products'
      }
    }).subscribe(function(match) {
      // One of our routes matched, we will quickly navigate to our parent
      // view to give the user a natural back button flow
      $timeout(function() {
        $state.go(match.$route.parent, match.$args);

        // Finally, we will navigate to the deeplink page. Now the user has
        // the 'product' view visibile, and the back button goes back to the
        // 'products' view.
        $timeout(function() {
          $state.go(match.$route.target, match.$args);
        }, 800);
      }, 100); // Timeouts can be tweaked to customize the feel of the deeplink
    }, function(nomatch) {
      console.warn('No match', nomatch);
    });
  });
}])
```

## iOS Configuration

As of iOS 9.2, Universal Links *must* be enabled in order to deep link to your app. Custom URL schemes are no longer supported.

Follow the official [Universal Links](https://developer.apple.com/library/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html) guide on the Apple Developer docs
to set up your domain to allow Universal Links.

## Android Configuration

Android supports Custom URL Scheme links, and as of Android 6.0 supports a similar feature to iOS' Universal Links called App Links.

Follow the App Links documentation on [Declaring Website Associations](https://developer.android.com/training/app-links/index.html#web-assoc) to enable your domain to
deeplink to your Android app.
