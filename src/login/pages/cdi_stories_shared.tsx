import type { KcContext } from "../KcContext";

/** Locale override type for stories; only EN and DE are used. */
export type StoryLocaleOverride = NonNullable<Extract<KcContext, { pageId: "login.ftl" }>["locale"]>;

const supportedEnDe = [
    { languageTag: "en", label: "English", url: "?kc_locale=en" },
    { languageTag: "de", label: "Deutsch", url: "?kc_locale=de" }
] as const satisfies readonly { languageTag: string; label: string; url: string }[];

export const realm = {
    name: "cdi",
    displayName: "CDI / HITS FDM Bayern Login ",
    displayNameHtml: "CDI / HITS FDM Bayern Login",
    internationalizationEnabled: true,
    registrationAllowed: false,
    resetPasswordAllowed: false
};
export const social = {
    providers: [
        {
            loginUrl: "oidc",
            alias: "oidc",
            providerId: "oidc",
            displayName: "DFN-AAI",
            iconClasses: "fa fa-cube"
        }
    ]
};

export const localeEN: StoryLocaleOverride = {
    currentLanguageTag: "en",
    supported: [...supportedEnDe]
};
export const localeDE: StoryLocaleOverride = {
    currentLanguageTag: "de",
    supported: [...supportedEnDe]
};

export function messagesPerField(names: string[], message: string) {
    return {
        exists: (fieldName: string) => names.includes(fieldName),
        existsError: (fieldName: string, ...otherFieldNames: string[]) => {
            const fieldNames = [fieldName, ...otherFieldNames];
            for (const name of names) {
                if (fieldNames.includes(name)) {
                    return true;
                }
            }
            return false;
        },
        get: (fieldName: string) => {
            if (names.includes(fieldName)) {
                return message;
            }
            return "";
        }
    };
}
