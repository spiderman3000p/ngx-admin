/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  production: true,
  appName: "Quick Services",
  azure: {
    clientId: "4becf416-7a56-4bb8-aaec-62ca76a7a4e0", // Application (client) ID from the app registration
    authority:
      "https://login.microsoftonline.com/38cb1598-762b-483f-85a7-a22892d0bbb6", // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
    redirectUri: "https://delightful-meadow-019603e10.1.azurestaticapps.net/", // This is your redirect URI
    profile: "https://graph.microsoft.com/v1.0/me",
  },
  google: {
    apiKey: "AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY",
  },
};
