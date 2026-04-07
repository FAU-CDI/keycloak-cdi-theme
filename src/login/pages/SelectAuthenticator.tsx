import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useState } from "react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import BoxedListItem from "../components/BoxedListItem";

import styles from "../components/CdiLoginPage.module.css";
import pageContent from "../components/PageContent.module.css";

export default function SelectAuthenticator(props: PageProps<Extract<KcContext, { pageId: "select-authenticator.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;
    const { url, auth } = kcContext;

    const { msg, advancedMsg } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("loginChooseAuthenticator")}>
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
                    <ul className={pageContent.selectListColumn}>
                        {auth.authenticationSelections.map(authenticationSelection => (
                            <BoxedListItem key={authenticationSelection.authExecId}>
                                <button
                                    type="submit"
                                    name="authenticationExecution"
                                    value={authenticationSelection.authExecId}
                                    disabled={isSubmitting}
                                    className={`${pageContent.optionButton} ${pageContent.optionButtonAlignStart}`}
                                >
                                    {authenticationSelection.iconCssClass ? (
                                        <i className={`${authenticationSelection.iconCssClass} ${pageContent.optionButtonIcon}`} aria-hidden />
                                    ) : (
                                        <span className={pageContent.optionButtonIconSpacer} aria-hidden />
                                    )}
                                    <span className={pageContent.optionButtonBody}>
                                        <span className={pageContent.optionButtonTitleBlock}>{advancedMsg(authenticationSelection.displayName)}</span>
                                        <span className={pageContent.optionButtonMeta}>{advancedMsg(authenticationSelection.helpText)}</span>
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
        <svg className={pageContent.chevronIconOffset} width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
    );
}
