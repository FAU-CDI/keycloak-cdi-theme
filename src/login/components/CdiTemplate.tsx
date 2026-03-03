import { useEffect, useState } from "react";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n, Key } from "../i18n";
import type { KcContext } from "../KcContext";
import DarkModeToggle from "./DarkModeToggle";
import LocaleSwitcher from "./LocaleSwitcher";

import logoUrl from "../images/CDI_Logo_cmyk.svg";

import styles from "./CdiTemplate.module.css";

export type CdiStaticButton = {
    type: Key;
    href: Record<string, string>;
    small?: boolean;
};

const CDI_LOGOS: { url: string; alt: Key }[] = [
    { url: logoUrl, alt: "cdiLogoAlt" },
    { url: logoUrl, alt: "cdiLogoAlt" }
];

const CDI_FOOTER_ROWS: CdiStaticButton[][] = [
    [
        { type: "cdiAbout", href: { "": "https://www.fdm-bayern.org/sso/" } },
        { type: "cdiContactSupport", href: { "": "mailto:cdi-sso@fau.de" } },
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

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;
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
                            <img key={idx} src={logo.url} alt={msgStr(logo.alt)} />
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
                            {row.map((button, index) => {
                                const href =
                                    button.href[currentLanguage?.languageTag ?? ""] ??
                                    button.href[""] ??
                                    "#";
                                return (
                                    <a
                                        key={index}
                                        href={href || "#"}
                                        data-small={button.small}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {msg(button.type)}
                                    </a>
                                );
                            })}
                        </div>
                    ))}
                </footer>
            </div>
        </div>
    );
}
