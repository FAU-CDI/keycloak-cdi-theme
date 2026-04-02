import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useState } from "react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import BoxedListItem from "../components/BoxedListItem";

import styles from "../components/CdiLoginPage.module.css";

const listStyle = {
    margin: 0,
    padding: 0,
    listStyle: "none" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.75rem"
};

const optionButtonStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    width: "100%",
    margin: 0,
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    textAlign: "left" as const,
    color: "var(--cdi-foreground)",
    font: "inherit"
};

export default function SelectAuthenticator(props: PageProps<Extract<KcContext, { pageId: "select-authenticator.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;
    const { url, auth } = kcContext;

    const { msg, advancedMsg } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const showMessage = kcContext.message !== undefined;
    const messageNode =
        showMessage && kcContext.message ? (
            <MessageAlert type={kcContext.message.type} summary={kcContext.message.summary} />
        ) : null;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("loginChooseAuthenticator")}>
            {messageNode}

            <form
                id="kc-select-credential-form"
                className={styles.form}
                action={url.loginAction}
                method="post"
                onSubmit={() => {
                    setIsSubmitting(true);
                    return true;
                }}
            >
                <div>
                    <ul style={listStyle}>
                        {auth.authenticationSelections.map(authenticationSelection => (
                            <BoxedListItem key={authenticationSelection.authExecId}>
                                <button
                                    type="submit"
                                    name="authenticationExecution"
                                    value={authenticationSelection.authExecId}
                                    disabled={isSubmitting}
                                    style={optionButtonStyle}
                                >
                                    {authenticationSelection.iconCssClass ? (
                                        <i
                                            className={authenticationSelection.iconCssClass}
                                            aria-hidden
                                            style={{ flexShrink: 0, lineHeight: 1.25 }}
                                        />
                                    ) : (
                                        <span style={{ width: "1.25rem", flexShrink: 0 }} aria-hidden />
                                    )}
                                    <span style={{ flex: "1 1 auto", minWidth: 0 }}>
                                        <span style={{ display: "block", fontWeight: 600 }}>
                                            {advancedMsg(authenticationSelection.displayName)}
                                        </span>
                                        <span
                                            style={{
                                                display: "block",
                                                fontSize: "0.875rem",
                                                marginTop: "0.25rem",
                                                opacity: 0.92
                                            }}
                                        >
                                            {advancedMsg(authenticationSelection.helpText)}
                                        </span>
                                    </span>
                                    <ChevronRightIcon />
                                </button>
                            </BoxedListItem>
                        ))}
                    </ul>
                </div>
            </form>
        </CdiTemplate>
    );
}

function ChevronRightIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            aria-hidden
            style={{ flexShrink: 0, marginTop: "0.125rem" }}
        >
            <path
                fill="currentColor"
                d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
            />
        </svg>
    );
}
