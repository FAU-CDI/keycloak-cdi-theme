import { useScript } from "keycloakify/login/pages/WebauthnRegister.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import LogoutOtherSessionsCheckbox from "../components/LogoutOtherSessionsCheckbox";
import { CDIButton } from "../components/CDIButton";

import formStyles from "../components/CdiLoginPage.module.css";
import pageContent from "../components/PageContent.module.css";
import { useId } from "react";

export default function WebauthnRegister(props: PageProps<Extract<KcContext, { pageId: "webauthn-register.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;

    const { url, isSetRetry, isAppInitiatedAction } = kcContext;

    const { msg, msgStr } = i18n;

    const authButtonId = useId();

    useScript({
        authButtonId,
        kcContext,
        i18n
    });

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("webauthn-registration-title")}>
            {isSetRetry ? (
                <p className={pageContent.webauthnRetryHint} role="status">
                    {msg("cdiWebauthnRegisterRetryHint")}
                </p>
            ) : null}
            <form id="register" action={url.loginAction} method="post">
                <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                <input type="hidden" id="attestationObject" name="attestationObject" />
                <input type="hidden" id="publicKeyCredentialId" name="publicKeyCredentialId" />
                <input type="hidden" id="authenticatorLabel" name="authenticatorLabel" />
                <input type="hidden" id="transports" name="transports" />
                <input type="hidden" id="error" name="error" />

                <div className={`${formStyles.optionsRow} ${formStyles.optionsRowStart}`}>
                    <LogoutOtherSessionsCheckbox i18n={i18n} omitOuterWrapper />
                </div>

                <div className={formStyles.form}>
                    <div>
                        <CDIButton id={authButtonId} type="submit">
                            {msgStr("doRegisterSecurityKey")}
                        </CDIButton>
                    </div>
                </div>
            </form>

            {!isSetRetry && isAppInitiatedAction && (
                <form action={url.loginAction} method="post">
                    <div className={formStyles.form}>
                        <div>
                            <CDIButton secondary type="submit" id="cancelWebAuthnAIA" name="cancel-aia" value="true">
                                {msg("doCancel")}
                            </CDIButton>
                        </div>
                    </div>
                </form>
            )}
        </CdiTemplate>
    );
}
