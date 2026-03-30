import { PageProps } from "keycloakify/login/pages/PageProps";
import { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import { CDIActions, CDIButton } from "../components/CDIButton";
import BoxedListItem from "../components/BoxedListItem";
import Collapsible from "../components/Collapsible";

export default function LoginOauthGrant(props: PageProps<Extract<KcContext, { pageId: "login-oauth-grant.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;
    const { url, oauth, client } = kcContext;

    const { msg, msgStr, advancedMsg, advancedMsgStr } = i18n;

    const showMessage = kcContext.message !== undefined;
    const messageNode = showMessage && kcContext.message ? <MessageAlert type={kcContext.message.type} summary={kcContext.message.summary} /> : null;

    const applicationName = client.name ? advancedMsgStr(client.name) : client.clientId;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("oauthGrantTitle", applicationName)}>
            {messageNode}

            <Collapsible defaultOpen={true} label={msg("oauthGrantRequest")} frozen>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "nowrap" }}>
                    {client.attributes.logoUri && (
                        <img src={client.attributes.logoUri} alt="" style={{ maxWidth: "10rem", maxHeight: "3rem", height: "auto", width: "auto" }} />
                    )}
                    <p style={{ margin: 0, flex: "1 1 auto", minWidth: 0 }}>
                        <strong>{applicationName}</strong> {msg("cdiOauthGrantIntroText")}
                    </p>
                </div>
                {oauth.clientScopesRequested.length > 0 ? (
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {oauth.clientScopesRequested.map((clientScope, idx) => (
                            <BoxedListItem key={`${clientScope.consentScreenText}-${idx}`}>
                                <p style={{ margin: 0 }}>
                                    {advancedMsg(clientScope.consentScreenText)}
                                    {clientScope.dynamicScopeParameter && (
                                        <>
                                            : <strong>{clientScope.dynamicScopeParameter}</strong>
                                        </>
                                    )}
                                </p>
                            </BoxedListItem>
                        ))}
                    </ul>
                ) : null}
            </Collapsible>

            {(client.attributes.tosUri || client.attributes.policyUri) && (
                <Collapsible
                    defaultOpen={true}
                    label={client.name ? msg("oauthGrantInformation", advancedMsgStr(client.name)) : msg("oauthGrantInformation", client.clientId)}
                    frozen
                >
                    <CDIActions layout="rowWrap">
                        {client.attributes.tosUri && (
                            <CDIButton as="a" secondary href={client.attributes.tosUri} target="_blank" rel="noreferrer">
                                {msg("oauthGrantTos")}
                            </CDIButton>
                        )}
                        {client.attributes.policyUri && (
                            <CDIButton as="a" secondary href={client.attributes.policyUri} target="_blank" rel="noreferrer">
                                {msg("oauthGrantPolicy")}
                            </CDIButton>
                        )}
                    </CDIActions>
                </Collapsible>
            )}

            <form action={url.oauthAction} method="post">
                <input type="hidden" name="code" value={oauth.code} />
                <CDIActions layout="rowWrap">
                    <CDIButton as="input" type="submit" name="accept" value={msgStr("doYes")} />
                    <CDIButton as="input" secondary type="submit" name="cancel" value={msgStr("doNo")} />
                </CDIActions>
            </form>
        </CdiTemplate>
    );
}
