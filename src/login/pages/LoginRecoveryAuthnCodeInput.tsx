import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useId, useState } from "react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import { CDIActions, CDIButton } from "../components/CDIButton";

import styles from "../components/CdiLoginPage.module.css";

export default function LoginRecoveryAuthnCodeInput(
    props: PageProps<Extract<KcContext, { pageId: "login-recovery-authn-code-input.ftl" }>, I18n>
) {
    const { kcContext, i18n } = props;

    const { url, messagesPerField, recoveryAuthnCodesInputBean } = kcContext;

    const { msg, msgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const recoveryInputId = useId();

    const hasFieldError = messagesPerField.existsError("recoveryCodeInput");

    const showMessage = kcContext.message !== undefined && !hasFieldError;
    const messageNode =
        showMessage && kcContext.message ? (
            <MessageAlert type={kcContext.message.type} summary={kcContext.message.summary} />
        ) : null;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("auth-recovery-code-header")}>
            {messageNode}

            <form
                className={styles.form}
                action={url.loginAction}
                method="post"
                onSubmit={() => {
                    setIsSubmitting(true);
                    return true;
                }}
            >
                <div>
                    <label htmlFor={recoveryInputId}>
                        {msg("auth-recovery-code-prompt", `${recoveryAuthnCodesInputBean.codeNumber}`)}
                    </label>
                    {hasFieldError && (
                        <div
                            role="alert"
                            aria-live="polite"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(messagesPerField.get("recoveryCodeInput"))
                            }}
                        />
                    )}
                    <input
                        tabIndex={1}
                        id={recoveryInputId}
                        name="recoveryCodeInput"
                        aria-invalid={hasFieldError}
                        autoComplete="off"
                        type="text"
                        autoFocus
                    />
                </div>

                <CDIActions layout="rowWrap">
                    <CDIButton as="input" name="login" type="submit" value={msgStr("doLogIn")} disabled={isSubmitting} />
                </CDIActions>
            </form>
        </CdiTemplate>
    );
}
