# ConnectedMD

# Setup
Install latest node, version 5.6.0 or later

`npm install -g cordova`, version 6.0.0 or later

`npm install -g gulp-cli`

`npm install -g grunt-cli`

change to the ConnectedMD folder. Run `npm install`. This will update components used for node.

change to the cordova folder. Run `npm install`. This will update components used for cordova and web.

# Updating components
change to the ConnectedMD folder. Run `npm update`. This will update components used for node.

change to the cordova folder. Run `npm update`. This will update components used for cordova and web.

# Running The Web Server as ionic server

change to the cordova folder

run `ionic serve`, this will start the local server and launch the browser. It will also create a www/build folder from the app folder.

# Running The Web Server as node server

change to the cordova folder

run `ionic serve`, this will start the local server. Then cancel ionic. It will also create a www/build folder from the app folder.

change to the ConnectedMD folder

run `node server.js port=80 env=dev api=http://localhost:8080/`

port => the port you want to use for local development. If you are running IIS, port 80 will not be available.

api => the base url for the api. If not specified, it will connect to the qa api

env => controls debuging, logging and settings. use `dev`, `qa`, `prod`.

# VSCode / Visual Studio Community 2015
You can use VSCode if you are just working with web code. To debug mobile, use Visual Studio.

# VS Code Addins

https://marketplace.visualstudio.com/items?itemName=vsmobile.cordova-tools

https://marketplace.visualstudio.com/items?itemName=sozercan.slack

https://marketplace.visualstudio.com/items?itemName=austin.vscode-twitter

https://marketplace.visualstudio.com/items?itemName=moozzyk.Arduino

https://marketplace.visualstudio.com/items?itemName=magicstack.MagicPython

https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion


# ionic startup messages
♬ ♫ ♬ ♫  Your Ionic app is ready to go! ♬ ♫ ♬ ♫

Make sure to cd into your new app directory:
  cd ConnectedMD

To run your app in the browser (great for initial development):
  ionic serve

To run on iOS:
  ionic run ios

To run on Android:
  ionic run android

To test your app on a device easily, try Ionic View:
  http://view.ionic.io

New! Add push notifications, update your app remotely, and package iOS and Android apps with the Ionic Platform!
https://apps.ionic.io/signup

New to Ionic? Get started here: http://ionicframework.com/docs/v2/getting-started