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




-   [ ] login-passkeys-conditional-authenticate.ftl
-   [ ] login-recovery-authn-code-config.ftl
-   [ ] login-recovery-authn-code-input.ftl
-   [ ] login-reset-otp.ftl
-   [ ] login-update-password.ftl
-   [ ] login-x509-info.ftl
-   [ ] logout-confirm.ftl
-   [ ] select-authenticator.ftl
-   [ ] select-organization.ftl
-   [ ] update-email.ftl
-   [x] login-page-expired.ftl
-   [x] code.ftl
-   [x] delete-account-confirm.ftl
-   [x] delete-credential.ftl
-   [x] error.ftl
-   [x] frontchannel-logout.ftl
-   [x] idp-review-user-profile.ftl
-   [x] info.ftl
-   [x] link-idp-action.ftl
-   [x] login-config-totp.ftl
-   [x] login-idp-link-confirm-override.ftl
-   [x] login-idp-link-confirm.ftl
-   [x] login-idp-link-email.ftl
-   [x] login-oauth-grant.ftl
-   [x] login-oauth2-device-verify-user-code.ftl
-   [x] login-otp.ftl
-   [x] login-password.ftl
-   [x] login-reset-password.ftl
-   [x] login-update-profile.ftl
-   [x] login-username.ftl
-   [x] login-verify-email.ftl
-   [x] login.ftl
-   [x] register.ftl
-   [x] saml-post-form.ftl
-   [x] terms.ftl
-   [x] webauthn-authenticate.ftl
-   [x] webauthn-error.ftl
-   [x] webauthn-register.ftl

Nice to have: - account theme - email theme

```bash
npx keycloakify initialize-account-theme
npx keycloakify initialize-email-theme
```

## LICENSE

The code is dervied from the original keycloakify code.
This code is licensed under [AGPL-3.0](./LICENSE).
This license does not include the logos, which are not licensed.
Additionally CDI and HITS may use the software without modification to offer the CDI / SSO HITS Login service, even if such usage is not allowed by the AGPL license.

The code was originally licensed under the following terms:
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
