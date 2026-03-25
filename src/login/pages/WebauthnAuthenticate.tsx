import { Fragment, useId } from "react";
import { useScript } from "keycloakify/login/pages/WebauthnAuthenticate.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import Collapsible from "../components/Collapsible";
import MessageAlert from "../components/MessageAlert";
import BoxedListItem from "../components/BoxedListItem";

import styles from "../components/CdiLoginPage.module.css";

type WebauthnAuthenticateKcContext = Extract<KcContext, { pageId: "webauthn-authenticate.ftl" }>;
type WebauthnAuthenticatePageProps = Omit<PageProps<WebauthnAuthenticateKcContext, I18n>, "Template">;

export default function WebauthnAuthenticate(props: WebauthnAuthenticatePageProps) {
    const { kcContext, i18n } = props;

    const { url, realm, registrationDisabled, authenticators, shouldDisplayAuthenticators, message, isAppInitiatedAction } = kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const authButtonId = useId();

    useScript({
        authButtonId,
        kcContext,
        i18n
    });

    const showMessage = message !== undefined && (message.type !== "warning" || !isAppInitiatedAction);
    const messageNode = showMessage && message ? <MessageAlert type={message.type} summary={message.summary} /> : null;

    const showRegister = realm.registrationAllowed && !registrationDisabled && url.registrationUrl !== undefined;
    const registerNode = showRegister ? (
        <Collapsible label={msgStr("noAccount")} defaultOpen={false}>
            <a tabIndex={6} href={url.registrationUrl} data-action-button role="button">
                {msgStr("doRegister")}
            </a>
        </Collapsible>
    ) : null;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} displayMessage={true} headerNode={msg("webauthn-login-title")}>
            {messageNode}

            <form id="webauth" action={url.loginAction} method="post">
                <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                <input type="hidden" id="authenticatorData" name="authenticatorData" />
                <input type="hidden" id="signature" name="signature" />
                <input type="hidden" id="credentialId" name="credentialId" />
                <input type="hidden" id="userHandle" name="userHandle" />
                <input type="hidden" id="error" name="error" />
            </form>

            {authenticators && (
                <>
                    <form id="authn_select">
                        {authenticators.authenticators.map(a => (
                            <input key={a.credentialId} type="hidden" name="authn_use_chk" readOnly value={a.credentialId} />
                        ))}
                    </form>

                    {shouldDisplayAuthenticators && authenticators.authenticators.length > 1 && <p>{msg("webauthn-available-authenticators")}: </p>}

                    {shouldDisplayAuthenticators && (
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem" }}>
                            {authenticators.authenticators.map((a, i) => (
                                <BoxedListItem key={a.credentialId} id={`kc-webauthn-authenticator-item-${i}`}>
                                    <div id={`kc-webauthn-authenticator-label-${i}`} style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                                        {advancedMsg(a.label)}
                                    </div>
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "max-content 1fr",
                                            gap: "0.25rem 0.5rem",
                                            alignItems: "baseline"
                                        }}
                                    >
                                        {a.transports.displayNameProperties?.length ? (
                                            <>
                                                <div style={{ fontWeight: 500, opacity: 0.8 }}>Transport:</div>
                                                <div id={`kc-webauthn-authenticator-transport-${i}`}>
                                                    {a.transports.displayNameProperties
                                                        .map((displayNameProperty, i, arr) => ({
                                                            displayNameProperty,
                                                            hasNext: i !== arr.length - 1
                                                        }))
                                                        .map(({ displayNameProperty, hasNext }) => (
                                                            <Fragment key={displayNameProperty}>
                                                                {advancedMsg(displayNameProperty)}
                                                                {hasNext && <span>, </span>}
                                                            </Fragment>
                                                        ))}
                                                </div>
                                            </>
                                        ) : null}
                                        <div id={`kc-webauthn-authenticator-createdlabel-${i}`} style={{ fontWeight: 500, opacity: 0.8 }}>
                                            {msg("webauthn-createdAt-label")}:
                                        </div>
                                        <div id={`kc-webauthn-authenticator-created-${i}`}>{a.createdAt}</div>
                                    </div>
                                </BoxedListItem>
                            ))}
                        </ul>
                    )}
                </>
            )}

            <div className={styles.form}>
                <div>
                    <button id={authButtonId} type="button" autoFocus data-action-button>
                        {msgStr("webauthn-doAuthenticate")}
                    </button>
                </div>
            </div>

            {registerNode}
        </CdiTemplate>
    );
}
