# Keycloak Templates for CDI / HITS SSO Login

This repository contains the Keycloak Templates for CDI / HITS SSO Login page.

They are based on [Keycloakify](https://www.keycloakify.dev).
For more information, see their [official docs](https://docs.keycloakify.dev/).

## Development Setup

```bash
# install dependencies
yarn install

# to also install maven, depending on your OS:
sudo apt-get install maven

brew install maven

choco install openjdk
choco install maven
```

### Testing the theme locally

[See also official docs](https://docs.keycloakify.dev/testing-your-theme)

```bash
# Using the Storybook UI (with live reload for development)
npm run storybook

# Inside an actual keycloak.
# This needs docker and maven.
npx keycloakify start-keycloak --keycloak-version 26
```

### Building the theme

[See also official docs](https://docs.keycloakify.dev/deploying-your-theme)

```bash
# Build an extension jar into ./dist_keycloak
# Needs maven installed.
npm run build-keycloak-theme
```

# How to customize the theme

```bash
# to add a new story to develop
npx keycloakify add-story

# to fully customize a template
npx keycloakify eject-page
```

# Building the theme

You need to have [Maven](https://maven.apache.org/) installed to build the theme (Maven >= 3.1.1, Java >= 7).  
The `mvn` command must be in the $PATH.

```bash
# Generates ./dist_keycloak/theme.jar using maven
npm run build-keycloak-theme
```

Note that by default Keycloakify generates multiple .jar files for different versions of Keycloak.  
You can customize this behavior, see documentation [here](https://docs.keycloakify.dev/features/compiler-options/keycloakversiontargets).

# TODO

```bash
npx keycloakify initialize-account-theme
npx keycloakify initialize-email-theme
```

- 404 page
- Account already exists - link theme

- Logos
- Header font size
- dark / light Logo variants
- mobile


- nice to have: email theme?
- account theme
- 2FA themeing

- Update logo
- English about page variant

## Nice to Haves:

-   Logo
-   Favicon

## LICENSE

This code is not currently licensed.

The original code was licensed under:

```
MIT License

Copyright (c) 2020 GitHub user u/garronej

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```
