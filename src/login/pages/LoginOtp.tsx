import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { Fragment, useId, useState } from "react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import Collapsible from "../components/Collapsible";
import MessageAlert from "../components/MessageAlert";
import BoxedListItem from "../components/BoxedListItem";
import { CDIActions, CDIButton } from "../components/CDIButton";

import styles from "../components/CdiLoginPage.module.css";

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;

    const { otpLogin, url, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const otpInputId = useId();
    const otpCredentialInputIdPrefix = useId();

    const showMessage = kcContext.message !== undefined;
    const messageNode =
        showMessage && kcContext.message ? (
            <MessageAlert type={kcContext.message.type} summary={kcContext.message.summary} />
        ) : null;

    const hasTotpError = messagesPerField.existsError("totp");

    return (
        <CdiTemplate
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            headerNode={msg("doLogIn")}
        >
            {messageNode}

            <form
                className={styles.form}
                action={url.loginAction}
                onSubmit={() => {
                    setIsSubmitting(true);
                    return true;
                }}
                method="post"
            >
                {otpLogin.userOtpCredentials.length > 1 && (
                    <Collapsible
                        frozen
                        defaultOpen={true}
                        label={msg("loginOtpSelectAuthenticator")}
                    >
                        <ul
                            style={{
                                margin: 0,
                                padding: 0,
                                listStyle: "none",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.75rem"
                            }}
                        >
                            {otpLogin.userOtpCredentials.map((otpCredential, index) => {
                                const inputId = `${otpCredentialInputIdPrefix}-${index}`;
                                return (
                                    <Fragment key={otpCredential.id}>
                                        <BoxedListItem>
                                            <label
                                                htmlFor={inputId}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.75rem",
                                                    margin: 0,
                                                    fontWeight: 500,
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <input
                                                    id={inputId}
                                                    type="radio"
                                                    name="selectedCredentialId"
                                                    value={otpCredential.id}
                                                    defaultChecked={
                                                        otpCredential.id === otpLogin.selectedCredentialId
                                                    }
                                                />
                                                <span>{otpCredential.userLabel}</span>
                                            </label>
                                        </BoxedListItem>
                                    </Fragment>
                                );
                            })}
                        </ul>
                    </Collapsible>
                )}

                {hasTotpError && (
                    <div
                        role="alert"
                        aria-live="polite"
                        dangerouslySetInnerHTML={{
                            __html: kcSanitize(messagesPerField.get("totp"))
                        }}
                    />
                )}

                <div>
                    <label htmlFor={otpInputId}>{msg("loginOtpOneTime")}</label>
                    <input
                        id={otpInputId}
                        name="otp"
                        autoComplete="off"
                        type="text"
                        autoFocus
                        aria-invalid={hasTotpError}
                    />
                </div>

                <CDIActions layout="rowWrap">
                    <CDIButton
                        as="input"
                        name="login"
                        type="submit"
                        value={msgStr("doLogIn")}
                        disabled={isSubmitting}
                    />
                </CDIActions>
            </form>
        </CdiTemplate>
    );
}
