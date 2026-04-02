import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useState } from "react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import { PasswordFieldWithReveal } from "../components/PasswordInputWithReveal";
import { CDIActions, CDIButton } from "../components/CDIButton";

import styles from "../components/CdiLoginPage.module.css";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    const { msg, msgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasPasswordOrConfirmError = messagesPerField.existsError("password", "password-confirm");
    const hasPasswordError = messagesPerField.existsError("password");
    const hasPasswordConfirmError = messagesPerField.existsError("password-confirm");

    const showMessage = kcContext.message !== undefined && !hasPasswordOrConfirmError;
    const messageNode = showMessage && kcContext.message ? <MessageAlert type={kcContext.message.type} summary={kcContext.message.summary} /> : null;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("updatePasswordTitle")}>
            {messageNode}

            <form
                id="kc-passwd-update-form"
                className={styles.form}
                action={url.loginAction}
                method="post"
                onSubmit={() => {
                    setIsSubmitting(true);
                    return true;
                }}
            >
                <div>
                    <label htmlFor="password-new">{msg("passwordNew")}</label>
                    <PasswordFieldWithReveal
                        inputId="password-new"
                        hasFieldError={hasPasswordOrConfirmError}
                        i18n={i18n}
                        inputProps={{
                            name: "password-new",
                            autoFocus: true,
                            autoComplete: "new-password",
                            "aria-invalid": hasPasswordOrConfirmError
                        }}
                    />
                    {hasPasswordError && (
                        <div
                            role="alert"
                            aria-live="polite"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(messagesPerField.get("password"))
                            }}
                        />
                    )}
                </div>

                <div>
                    <label htmlFor="password-confirm">{msg("passwordConfirm")}</label>
                    <PasswordFieldWithReveal
                        inputId="password-confirm"
                        hasFieldError={hasPasswordOrConfirmError}
                        i18n={i18n}
                        inputProps={{
                            name: "password-confirm",
                            autoComplete: "new-password",
                            "aria-invalid": hasPasswordOrConfirmError
                        }}
                    />
                    {hasPasswordConfirmError && (
                        <div
                            role="alert"
                            aria-live="polite"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(messagesPerField.get("password-confirm"))
                            }}
                        />
                    )}
                </div>

                <LogoutOtherSessions i18n={i18n} />

                <CDIActions layout={isAppInitiatedAction ? "rowWrap" : undefined}>
                    <CDIButton as="input" type="submit" value={msgStr("doSubmit")} disabled={isSubmitting} />
                    {isAppInitiatedAction && (
                        <CDIButton name="cancel-aia" value="true" type="submit" secondary disabled={isSubmitting}>
                            {msg("doCancel")}
                        </CDIButton>
                    )}
                </CDIActions>
            </form>
        </CdiTemplate>
    );
}

function LogoutOtherSessions(props: { i18n: I18n }) {
    const { i18n } = props;
    const { msg } = i18n;

    return (
        <div style={{ margin: "1rem 0" }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" defaultChecked={true} />
                <span>{msg("logoutOtherSessions")}</span>
            </label>
        </div>
    );
}
