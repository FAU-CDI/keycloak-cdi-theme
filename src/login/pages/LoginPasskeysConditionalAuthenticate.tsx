import { Fragment, useId } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useScript } from "keycloakify/login/pages/LoginPasskeysConditionalAuthenticate.useScript";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import Collapsible from "../components/Collapsible";
import BoxedListItem from "../components/BoxedListItem";
import { CDIButton } from "../components/CDIButton";

import styles from "../components/CdiLoginPage.module.css";
import pageContent from "../components/PageContent.module.css";

export default function LoginPasskeysConditionalAuthenticate(
    props: PageProps<Extract<KcContext, { pageId: "login-passkeys-conditional-authenticate.ftl" }>, I18n>
) {
    const { kcContext, i18n } = props;

    const { messagesPerField, login, url, usernameHidden, shouldDisplayAuthenticators, authenticators, realm } = kcContext;

    const { msg, advancedMsg } = i18n;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("passkey-login-title")}>
            <form id="webauth" action={url.loginAction} method="post">
                <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                <input type="hidden" id="authenticatorData" name="authenticatorData" />
                <input type="hidden" id="signature" name="signature" />
                <input type="hidden" id="credentialId" name="credentialId" />
                <input type="hidden" id="userHandle" name="userHandle" />
                <input type="hidden" id="error" name="error" />
            </form>

            {authenticators !== undefined && authenticators.authenticators.length !== 0 && (
                <>
                    <form id="authn_select">
                        {authenticators.authenticators.map((authenticator, i) => (
                            <input key={i} type="hidden" name="authn_use_chk" readOnly value={authenticator.credentialId} />
                        ))}
                    </form>

                    {shouldDisplayAuthenticators && (
                        <Collapsible defaultOpen={true} frozen label={msg("passkey-available-authenticators")}>
                            <ul className={pageContent.passkeyAuthenticatorList}>
                                {authenticators.authenticators.map((authenticator, i) => (
                                    <Fragment key={i}>
                                        <BoxedListItem>
                                            <div className={pageContent.passkeyAuthenticatorBody}>
                                                <strong>{advancedMsg(authenticator.label)}</strong>
                                                {authenticator.transports?.displayNameProperties?.length ? (
                                                    <span>{authenticator.transports.displayNameProperties.map(p => advancedMsg(p)).join(", ")}</span>
                                                ) : null}
                                                <span>
                                                    {msg("passkey-createdAt-label")} {authenticator.createdAt}
                                                </span>
                                            </div>
                                        </BoxedListItem>
                                    </Fragment>
                                ))}
                            </ul>
                        </Collapsible>
                    )}
                </>
            )}

            {realm.password && (
                <form id="kc-form-login" action={url.loginAction} method="post">
                    {!usernameHidden && (
                        <div className={styles.form}>
                            {messagesPerField.existsError("username") && (
                                <div role="alert" aria-live="polite">
                                    {messagesPerField.get("username")}
                                </div>
                            )}
                            <div>
                                <label htmlFor="username">{msg("passkey-autofill-select")}</label>
                                <input
                                    tabIndex={1}
                                    id="username"
                                    aria-invalid={messagesPerField.existsError("username")}
                                    name="username"
                                    defaultValue={login.username ?? ""}
                                    autoComplete="username webauthn"
                                    type="text"
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}
                </form>
            )}

            <PasskeyConditionalAuthenticateInput kcContext={kcContext} i18n={i18n} />
        </CdiTemplate>
    );
}

type PasskeysPageKcContext = Extract<KcContext, { pageId: "login-passkeys-conditional-authenticate.ftl" }>;

function PasskeyConditionalAuthenticateInput(props: { kcContext: PasskeysPageKcContext; i18n: I18n }) {
    const { kcContext, i18n } = props;
    const { msgStr } = i18n;

    const authButtonId = useId();
    useScript({ authButtonId, kcContext, i18n });

    return (
        <div id="kc-form-passkey-button" className={pageContent.hidden}>
            <CDIButton as="input" id={authButtonId} type="button" autoFocus value={msgStr("passkey-doAuthenticate")} />
        </div>
    );
}
