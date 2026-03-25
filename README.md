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
npx keycloak
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

-   Logos for FDM
-   English about page variant

Nice to have login theme pages:

-   [x] login.ftl
-   [x] login-username.ftl
-   [x] login-password.ftl
-   [ ] webauthn-authenticate.ftl
-   [ ] webauthn-register.ftl
-   [ ] register.ftl
-   [ ] info.ftl
-   [x] error.ftl
-   [ ] login-reset-password.ftl
-   [x] login-verify-email.ftl
-   [ ] terms.ftl
-   [ ] login-oauth2-device-verify-user-code.ftl
-   [ ] login-oauth-grant.ftl
-   [ ] login-otp.ftl
-   [x] login-update-profile.ftl
-   [ ] login-update-password.ftl
-   [ ] link-idp-action.ftl
-   [x] login-idp-link-confirm.ftl
-   [x] login-idp-link-email.ftl
-   [ ] login-page-expired.ftl
-   [ ] login-config-totp.ftl
-   [ ] logout-confirm.ftl
-   [x] idp-review-user-profile.ftl
-   [ ] update-email.ftl
-   [ ] select-authenticator.ftl
-   [ ] saml-post-form.ftl
-   [ ] delete-credential.ftl
-   [ ] code.ftl
-   [ ] delete-account-confirm.ftl
-   [ ] frontchannel-logout.ftl
-   [ ] login-recovery-authn-code-config.ftl
-   [ ] login-recovery-authn-code-input.ftl
-   [ ] login-reset-otp.ftl
-   [ ] login-x509-info.ftl
-   [ ] webauthn-error.ftl
-   [ ] login-passkeys-conditional-authenticate.ftl
-   [ ] login-idp-link-confirm-override.ftl
-   [ ] select-organization.ftl

Nice to have: - account theme - email theme

```bash
npx keycloakify initialize-account-theme
npx keycloakify initialize-email-theme
```

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
