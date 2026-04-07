import { Fragment, useId } from "react";
import { useScript } from "keycloakify/login/pages/WebauthnAuthenticate.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import Collapsible from "../components/Collapsible";
import BoxedListItem from "../components/BoxedListItem";
import { CDIButton } from "../components/CDIButton";

import styles from "../components/CdiLoginPage.module.css";
import pageContent from "../components/PageContent.module.css";

type WebauthnAuthenticateKcContext = Extract<KcContext, { pageId: "webauthn-authenticate.ftl" }>;
type WebauthnAuthenticatePageProps = Omit<PageProps<WebauthnAuthenticateKcContext, I18n>, "Template">;

export default function WebauthnAuthenticate(props: WebauthnAuthenticatePageProps) {
    const { kcContext, i18n } = props;

    const { url, realm, registrationDisabled, authenticators, shouldDisplayAuthenticators } = kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const authButtonId = useId();
    useScript({ authButtonId, kcContext, i18n });

    const showRegister = realm.registrationAllowed && !registrationDisabled && url.registrationUrl !== undefined;
    const registerNode = showRegister ? (
        <Collapsible label={msgStr("noAccount")} defaultOpen={false}>
            <CDIButton as="a" tabIndex={6} href={url.registrationUrl} role="button">
                {msgStr("doRegister")}
            </CDIButton>
        </Collapsible>
    ) : null;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("webauthn-login-title")}>
            <form id="webauth" action={url.loginAction} method="post">
                <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                <input type="hidden" id="authenticatorData" name="authenticatorData" />
                <input type="hidden" id="signature" name="signature" />
                <input type="hidden" id="credentialId" name="credentialId" />
                <input type="hidden" id="userHandle" name="userHandle" />
                <input type="hidden" id="error" name="error" />
            </form>

            <Collapsible defaultOpen={true} label={msg("webauthn-doAuthenticate")}>
                {authenticators && (
                    <>
                        <form id="authn_select">
                            {authenticators.authenticators.map(a => (
                                <input key={a.credentialId} type="hidden" name="authn_use_chk" readOnly value={a.credentialId} />
                            ))}
                        </form>

                        {shouldDisplayAuthenticators && (
                            <ul className={pageContent.webauthnAuthenticatorList}>
                                {authenticators.authenticators.map(a => (
                                    <BoxedListItem key={a.credentialId}>
                                        <div className={pageContent.webauthnAuthenticatorLabel}>{advancedMsg(a.label)}</div>
                                        <div className={pageContent.webauthnDetailGrid}>
                                            {a.transports.displayNameProperties?.length ? (
                                                <>
                                                    <div className={pageContent.webauthnMetaLabel}>Transport:</div>
                                                    <div>
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
                                            <div className={pageContent.webauthnMetaLabel}>{msg("webauthn-createdAt-label")}:</div>
                                            <div>{a.createdAt}</div>
                                        </div>
                                    </BoxedListItem>
                                ))}
                            </ul>
                        )}
                    </>
                )}

                <div className={styles.form}>
                    <CDIButton id={authButtonId} type="button" autoFocus>
                        {msgStr("webauthn-doAuthenticate")}
                    </CDIButton>
                </div>
            </Collapsible>
            {registerNode}
        </CdiTemplate>
    );
}
