npm i expo
npm i -g eas-cli
npm i
// Configure app.json (app name, package name)
npx expo login
// Configure eas.json (buildType:'apk', distribution:'internal')
Ensure eas.json contains:
// "production": {
//      "autoIncrement": true,
//     "android": {
//        "buildType": "apk"
//      }
//    } 
eas build:configure
eas build -p android --profile production

If needed, run: npx expo-doctor
To run on emulator: npx expo start

######Next Steps#######
npm i expo
npm i -g eas-cli
npm i
// Configure app.json (app name, package name)
npx expo login
// Configure eas.json (buildType:'apk', distribution:'internal')
Ensure eas.json contains:
"production": {
      "autoIncrement": true,
      "android": {
        "buildType": "app-bundle"  // Change this to "app-bundle"
      }
    }
  },

eas build:configure
eas build -p android --profile production

If needed, run: npx expo-doctor
To run on emulator: npx expo start