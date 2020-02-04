// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular
  .module("starter", ["ionic"])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs).
      // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
      // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
      // useful especially with forms, though we would prefer giving the user a little more room
      // to interact with the app.
      if (window.cordova && window.Keyboard) {
        window.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if (window.StatusBar) {
        // Set the statusbar to use the default style, tweak this to
        // remove the status bar on iOS or change it to use white instead of dark colors.
        StatusBar.styleDefault();
      }
      if (BackgroundGeolocation) {
        // Set the statusbar to use the default style, tweak this to
        // remove the status bar on iOS or change it to use white instead of dark colors.
        console.log(`loaded`);
      }
      BackgroundGeolocation.configure(
        {
          locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
          desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
          stationaryRadius: 50,
          distanceFilter: 50,
          notificationTitle: "Background tracking",
          notificationText: "enabled",
          debug: true,
          interval: 10000,
          fastestInterval: 5000,
          activitiesInterval: 10000,
          url: "http://192.168.0.110:3000/geo",
          httpHeaders: {
            "X-FOO": "bar"
          },
          // customize post properties
          postTemplate: {
            lat: "@latitude",
            lon: "@longitude",
            foo: "bar" // you can also add your own properties
          }
        },
        () => console.log("passou")
      );

      BackgroundGeolocation.on("location", function(location) {
        console.log(location);

        // let URL = "http://192.168.0.110:3000/geo";

        // fetch(URL, {
        //   method: "POST",
        //   body: JSON.stringify({
        //     title: "rafael",
        //     userId: 1
        //   }),
        //   headers: {
        //     "Content-type": "application/json; charset=UTF-8"
        //   }
        // })
        //   .then(response => response.json())
        //   .then(json => console.log(json));
        // handle your locations here
        // to perform long running operation on iOS
        // you need to create background task
        BackgroundGeolocation.startTask(function(taskKey) {
          // execute long running task
          // eg. ajax post location
          // IMPORTANT: task has to be ended by endTask
          BackgroundGeolocation.endTask(taskKey);
        });
      });

      BackgroundGeolocation.on("stationary", function(stationaryLocation) {
        console.log("stationaryLocation", stationaryLocation);

        // handle stationary locations here
      });

      BackgroundGeolocation.on("error", function(error) {
        console.log(
          "[ERROR] BackgroundGeolocation error:",
          error.code,
          error.message
        );
      });

      BackgroundGeolocation.on("start", function() {
        console.log("[INFO] BackgroundGeolocation service has been started");
      });

      BackgroundGeolocation.on("stop", function() {
        console.log("[INFO] BackgroundGeolocation service has been stopped");
      });

      BackgroundGeolocation.on("authorization", function(status) {
        console.log(
          "[INFO] BackgroundGeolocation authorization status: " + status
        );
        if (status !== BackgroundGeolocation.AUTHORIZED) {
          // we need to set delay or otherwise alert may not be shown
          setTimeout(function() {
            var showSettings = confirm(
              "App requires location tracking permission. Would you like to open app settings?"
            );
            if (showSettings) {
              return BackgroundGeolocation.showAppSettings();
            }
          }, 1000);
        }
      });

      BackgroundGeolocation.on("background", function() {
        console.log("[INFO] App is in background");
        // you can also reconfigure service (changes will be applied immediately)
        console.log("background started", BackgroundGeolocation);
        // BackgroundGeolocation.getCurrentLocation(onSuccess =>
        //   console.log(onSuccess.latitude, onSuccess.longitude, "here")
        // );
        setInterval(() => {
          // console.log("background called configure", BackgroundGeolocation);
          BackgroundGeolocation.getCurrentLocation(onSuccess =>
            console.log(onSuccess.latitude, onSuccess.longitude, "here")
          );
          //BackgroundGeolocation.configure({ debug: true });
        }, 60000);
      });

      BackgroundGeolocation.on("foreground", function() {
        console.log("[INFO] App is in foreground");
        BackgroundGeolocation.configure({ debug: false });
      });

      BackgroundGeolocation.on("abort_requested", function() {
        console.log("[INFO] Server responded with 285 Updates Not Required");

        // Here we can decide whether we want stop the updates or not.
        // If you've configured the server to return 285, then it means the server does not require further update.
        // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
        // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
      });

      BackgroundGeolocation.on("http_authorization", () => {
        console.log("[INFO] App needs to authorize the http requests");
      });

      BackgroundGeolocation.checkStatus(function(status) {
        console.log(
          "[INFO] BackgroundGeolocation service is running",
          status.isRunning
        );
        console.log(
          "[INFO] BackgroundGeolocation services enabled",
          status.locationServicesEnabled
        );
        console.log(
          "[INFO] BackgroundGeolocation auth status: " + status.authorization
        );

        // you don't need to check status before start (this is just the example)
        if (!status.isRunning) {
          BackgroundGeolocation.start(); //triggers start on start event
        }
      });
    });
  });
