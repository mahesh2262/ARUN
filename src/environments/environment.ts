/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// export const environment = {
//   production: false,
// };

export const environment = {
  production: false,
  hmr: false,
  // baseAddress: "https://uatwhite-digitalonboarding.jkcement.com/CP_API/api/",
  baseAddress: "https://localhost:7257/api/",
  attestrAddress: "https://api.attestr.com/",
  attestrToken:
    "T1gwWFJzampZUUhEcFlEeUgwLmM1NWNkNDNkMjE3NGRkOTg5OWY5NzBiNjllOWU3ZjNkOjdkNWI3ZTM2YmYzM2YzNDc0ODhkMGQyMzg5MDRiMWEwNzkyY2QwODVlMmEwMGFiMw==",
  clientId: "ngAuthApp",
};
