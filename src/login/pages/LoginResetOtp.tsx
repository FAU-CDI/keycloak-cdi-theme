import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useId, useState } from "react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import OtpCredentialRadioList from "../components/OtpCredentialRadioList";
import { CDIActions, CDIButton } from "../components/CDIButton";

import styles from "../components/CdiLoginPage.module.css";

export default function LoginResetOtp(props: PageProps<Extract<KcContext, { pageId: "login-reset-otp.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;

    const { url, messagesPerField, configuredOtpCredentials } = kcContext;

    const { msg, msgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const credentialInputIdPrefix = useId();

    const hasTotpError = messagesPerField.existsError("totp");

    const showMessage = kcContext.message !== undefined && !hasTotpError;
    const messageNode = showMessage && kcContext.message ? <MessageAlert type={kcContext.message.type} summary={kcContext.message.summary} /> : null;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("doLogIn")}>
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
                    <p style={{ margin: "0 0 1rem" }}>{msg("otp-reset-description")}</p>

                    {hasTotpError && (
                        <div
                            role="alert"
                            aria-live="polite"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(messagesPerField.get("totp"))
                            }}
                        />
                    )}

                    <OtpCredentialRadioList
                        credentials={configuredOtpCredentials.userOtpCredentials}
                        selectedCredentialId={configuredOtpCredentials.selectedCredentialId}
                        idPrefix={credentialInputIdPrefix}
                    />
                </div>

                <CDIActions layout="rowWrap">
                    <CDIButton as="input" id="kc-otp-reset-form-submit" type="submit" value={msgStr("doSubmit")} disabled={isSubmitting} />
                </CDIActions>
            </form>
        </CdiTemplate>
    );
}
