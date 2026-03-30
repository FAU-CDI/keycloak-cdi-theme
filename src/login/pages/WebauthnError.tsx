import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import { CDIButton } from "../components/CDIButton";

export default function WebauthnError(props: PageProps<Extract<KcContext, { pageId: "webauthn-error.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;

    const { url, isAppInitiatedAction, message } = kcContext;

    const { msg, msgStr } = i18n;

    const showMessage = message !== undefined && (message.type !== "warning" || !isAppInitiatedAction);
    const messageNode = showMessage && message ? <MessageAlert type={message.type} summary={message.summary} /> : null;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} displayMessage={true} headerNode={msg("webauthn-error-title")}>
            {messageNode}

            <form id="kc-error-credential-form" action={url.loginAction} method="post">
                <input type="hidden" id="executionValue" name="authenticationExecution" />
                <input type="hidden" id="isSetRetry" name="isSetRetry" />
            </form>

            <div>
                <CDIButton
                    tabIndex={4}
                    type="button"
                    name="try-again"
                    id="kc-try-again"
                    onClick={() => {
                        (document.getElementById("isSetRetry") as HTMLInputElement | null)?.setAttribute("value", "retry");
                        (document.getElementById("executionValue") as HTMLInputElement | null)?.setAttribute("value", "${execution}");
                        (document.getElementById("kc-error-credential-form") as HTMLFormElement | null)?.requestSubmit();
                    }}
                >
                    {msgStr("doTryAgain")}
                </CDIButton>
            </div>
            {isAppInitiatedAction && (
                <form action={url.loginAction} id="kc-webauthn-settings-form" method="post">
                    <CDIButton secondary type="submit" id="cancelWebAuthnAIA" name="cancel-aia" value="true">
                        {msgStr("doCancel")}
                    </CDIButton>
                </form>
            )}
        </CdiTemplate>
    );
}
