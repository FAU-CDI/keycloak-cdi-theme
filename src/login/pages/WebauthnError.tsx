import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import { CDIButton } from "../components/CDIButton";
import { useRef } from "react";

export default function WebauthnError(props: PageProps<Extract<KcContext, { pageId: "webauthn-error.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;

    const { url, isAppInitiatedAction } = kcContext;

    const { msg, msgStr } = i18n;

    const isSetRetry = useRef<HTMLInputElement>(null);
    const executionValue = useRef<HTMLInputElement>(null);
    const kcErrorCredentialForm = useRef<HTMLFormElement>(null);

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("webauthn-error-title")}>
            <form ref={kcErrorCredentialForm} action={url.loginAction} method="post">
                <input type="hidden" ref={executionValue} name="authenticationExecution" />
                <input type="hidden" ref={isSetRetry} name="isSetRetry" />
            </form>

            <div>
                <CDIButton
                    tabIndex={4}
                    type="button"
                    name="try-again"
                    id="kc-try-again"
                    onClick={() => {
                        isSetRetry.current?.setAttribute("value", "retry");
                        executionValue.current?.setAttribute("value", "${execution}");
                        kcErrorCredentialForm.current?.requestSubmit();
                    }}
                >
                    {msgStr("doTryAgain")}
                </CDIButton>
            </div>
            {isAppInitiatedAction && (
                <form action={url.loginAction} method="post">
                    <CDIButton secondary type="submit" id="cancelWebAuthnAIA" name="cancel-aia" value="true">
                        {msgStr("doCancel")}
                    </CDIButton>
                </form>
            )}
        </CdiTemplate>
    );
}
