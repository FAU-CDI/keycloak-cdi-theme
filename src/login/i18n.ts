/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            cdiSelectInstitution: "Select your institution",
            cdiSelectInstitutionIntro:
                "Please verify your membership with an academic institution. To complete the login process, we additionally need your name and a valid email address.",
            cdiSelectInstitutionWith: "Select Your Institution with {0}",
            cdiGivenLocalAccount: "Log in with CDI username and password",
            cdiWelcomeText:
                'To sign in we need to know that you are a member of an academic institution. If you encounter any problems (for instance your institution is not listed on the following page), please check the "About Login Service" page.',
            cdiLogoAlt: "CDI Logo",
            cdiContactSupport: "Contact Support",
            cdiAbout: "About Login Service",
            cdiPrivacyPolicy: "Privacy Policy",
            cdiImprint: "Imprint",
            cdiAccessibility: "Accessibility",
            cdiSwitchToDark: "Switch to dark mode",
            cdiSwitchToLight: "Switch to light mode",
            showPassword: "Show",
            hidePassword: "Hide",
            cdiUpdateProfileIntro:
                "Please check the details above and click the Submit button to save. Your email address will need to be verified before your account can be used."
        },
        de: {
            cdiSelectInstitution: "Institution wählen",
            cdiSelectInstitutionIntro:
                "Bitte verifizieren Sie Ihre Zugehörigkeit zu einer akademischen Institution. Um den Login Vorgang abzuschließen, benötigen wir zusätzlich Ihren Namen und eine gültige E-Mail Adresse.",
            cdiSelectInstitutionWith: "Institution wählen mit {0}",
            cdiGivenLocalAccount: "Mit CDI Nutzername und Passwort anmelden",
            cdiWelcomeText:
                'Um sich anzumelden, benötigen wir die Bestätigung, dass Sie Mitglied einer akademischen Institution sind. Wenn Probleme auftreten (z.B. wenn Ihre Institution auf der nächsten Seite nicht aufgelistet ist), nutzen Sie bitte die Dokumentationsseite ("About Login Service").',
            cdiLogoAlt: "CDI-Logo",
            cdiContactSupport: "Support kontaktieren",
            cdiAbout: "About Login Service",
            cdiPrivacyPolicy: "Datenschutz",
            cdiImprint: "Impressum",
            cdiAccessibility: "Barrierefreiheit",
            cdiSwitchToDark: "Zu Dunkelmodus wechseln",
            cdiSwitchToLight: "Zu Hellmodus wechseln",
            showPassword: "Anzeigen",
            hidePassword: "Verbergen",
            cdiUpdateProfileIntro:
                "Bitte prüfen Sie die Angaben oben und nutzen Sie den Absenden-Button, um die Änderungen zu speichern. Ihre E-Mail-Adresse muss verifiziert werden, bevor Sie Ihr Konto nutzen können."
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

type Key = Parameters<I18n["msg"]>[0];

export { useI18n, type I18n, type Key };
