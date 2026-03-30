import { useScript } from "keycloakify/login/pages/WebauthnRegister.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import { CDIButton } from "../components/CDIButton";

import formStyles from "../components/CdiLoginPage.module.css";

export default function WebauthnRegister(props: PageProps<Extract<KcContext, { pageId: "webauthn-register.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;

    const { url, isSetRetry, isAppInitiatedAction, message } = kcContext;

    const { msg, msgStr } = i18n;

    const authButtonId = "authenticateWebAuthnButton";

    useScript({
        authButtonId,
        kcContext,
        i18n
    });

    const showMessage = message !== undefined && (message.type !== "warning" || !isAppInitiatedAction);
    const messageNode = showMessage && message ? <MessageAlert type={message.type} summary={message.summary} /> : null;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} displayMessage={true} headerNode={msg("webauthn-registration-title")}>
            {messageNode}
            <form id="register" action={url.loginAction} method="post">
                <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                <input type="hidden" id="attestationObject" name="attestationObject" />
                <input type="hidden" id="publicKeyCredentialId" name="publicKeyCredentialId" />
                <input type="hidden" id="authenticatorLabel" name="authenticatorLabel" />
                <input type="hidden" id="transports" name="transports" />
                <input type="hidden" id="error" name="error" />

                <div className={formStyles.optionsRow} style={{ justifyContent: "flex-start" }}>
                    <label htmlFor="logout-sessions">
                        <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" defaultChecked /> {msg("logoutOtherSessions")}
                    </label>
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
                <form action={url.loginAction} id="kc-webauthn-settings-form" method="post">
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
