import { useEffect, useState } from "react";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n, Key } from "../i18n";
import type { KcContext } from "../KcContext";
import DarkModeToggle from "./DarkModeToggle";
import LocaleSwitcher from "./LocaleSwitcher";

import cdiLightLogo from "../images/cdi-light.svg";
import cdiDarkLogo from "../images/cdi-dark.svg";
import styles from "./CdiTemplate.module.css";

const CDI_LOGOS: {
    lightUrl: string;
    darkUrl: string;
    alt: Key;
    href: Record<string, string>;
}[] = [
    {
        lightUrl: cdiLightLogo,
        darkUrl: cdiDarkLogo,
        alt: "cdiLogoAlt",
        href: {
            "": "https://www.cdi.fau.de/en/",
            de: "https://www.cdi.fau.de/"
        }
    },
    {
        lightUrl: cdiLightLogo,
        darkUrl: cdiDarkLogo,
        alt: "cdiLogoAlt",
        href: {
            "": "https://www.cdi.fau.de/en/",
            de: "https://www.cdi.fau.de/"
        }
    }
];

const CDI_FOOTER_ROWS: {
    type: Key;
    href: Record<string, string>;
    small?: boolean;
}[][] = [
    [
        { type: "cdiAbout", href: { "": "https://www.fdm-bayern.org/sso/" } },
        { type: "cdiContactSupport", href: { "": "mailto:cdi-sso@fau.de" } }
    ],
    [
        {
            type: "cdiPrivacyPolicy",
            href: {
                "": "https://www.cdi.fau.de/en/privacy/",
                de: "https://www.cdi.fau.de/datenschutz/"
            },
            small: true
        },
        {
            type: "cdiImprint",
            href: {
                "": "https://www.cdi.fau.de/en/imprint/",
                de: "https://www.cdi.fau.de/impressum/"
            },
            small: true
        },
        {
            type: "cdiAccessibility",
            href: {
                "": "https://www.cdi.fau.de/en/accessibility",
                de: "https://www.cdi.fau.de/barrierefreiheit/"
            },
            small: true
        }
    ]
];

function getPreferredColorScheme(): boolean {
    // in development or headless mode, always use light mode.
    // otherwise check what the browser has set via media query.
    if (process.env.NODE_ENV !== "production" || typeof window === "undefined")
        return false;
    try {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
        return false;
    }
}

export default function CdiTemplate(props: TemplateProps<KcContext, I18n>) {
    const { headerNode, documentTitle, kcContext, i18n, children } = props;

    const { msgStr, currentLanguage, enabledLanguages } = i18n;
    const [isDark, setIsDark] = useState(getPreferredColorScheme);

    const { realm } = kcContext;

    useEffect(() => {
        document.title =
            documentTitle ?? msgStr("loginTitle", realm.displayName || realm.name);
    }, []);

    // if we're not ready to render, don't render!
    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss: false });

    if (!isReadyToRender) {
        return null;
    }

    const languageSwitcher =
        enabledLanguages.length > 1 ? (
            <LocaleSwitcher
                currentLanguage={currentLanguage}
                enabledLanguages={enabledLanguages}
                ariaLabel={msgStr("languages")}
            />
        ) : undefined;

    const darkModeToggle = (
        <DarkModeToggle
            isDark={isDark}
            onToggle={() => setIsDark(d => !d)}
            labelSwitchToDark={msgStr("cdiSwitchToDark")}
            labelSwitchToLight={msgStr("cdiSwitchToLight")}
        />
    );

    return (
        <div className={styles.root} data-theme={isDark ? "dark" : "light"}>
            <div>
                <header>
                    <div>
                        {CDI_LOGOS.map((logo, idx) => (
                            <Logo key={idx} isDark={isDark} logo={logo} i18n={i18n} />
                        ))}
                        <span>
                            {languageSwitcher}
                            {darkModeToggle}
                        </span>
                    </div>
                    <h1>{headerNode}</h1>
                </header>
                <main>{children}</main>
                <footer>
                    {CDI_FOOTER_ROWS.map((row, rowIndex) => (
                        <div key={rowIndex} className={styles.footerRow}>
                            {row.map((button, index) => (
                                <FooterButton key={index} button={button} i18n={i18n} />
                            ))}
                        </div>
                    ))}
                </footer>
            </div>
        </div>
    );
}

function Logo(props: { isDark: boolean; logo: (typeof CDI_LOGOS)[number]; i18n: I18n }) {
    const {
        isDark,
        logo: { lightUrl, darkUrl, alt, href },
        i18n: { msgStr, currentLanguage }
    } = props;
    const resolvedHref = resolveHref(href, currentLanguage.languageTag);
    return (
        <a href={resolvedHref} target="_blank" rel="noreferrer">
            <img src={isDark ? darkUrl : lightUrl} alt={msgStr(alt)} />
        </a>
    );
}

function FooterButton(props: {
    button: (typeof CDI_FOOTER_ROWS)[number][number];
    i18n: I18n;
}) {
    const {
        button,
        i18n: { msg, currentLanguage }
    } = props;
    const href = resolveHref(button.href, currentLanguage.languageTag);

    return (
        <a href={href} data-small={button.small}>
            {msg(button.type)}
        </a>
    );
}

function resolveHref(href: Record<string, string>, currentLanguage: string): string {
    return href[currentLanguage] ?? href[""] ?? "#";
}
