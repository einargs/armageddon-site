// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDiM2qVB8b3tGLMebIfOR8p0h3KiotLvtY",
    authDomain: "armageddon-cloud.firebaseapp.com",
    databaseURL: "https://armageddon-cloud.firebaseio.com",
    projectId: "armageddon-cloud",
    storageBucket: "armageddon-cloud.appspot.com",
    messagingSenderId: "539353400838"
  }
};
