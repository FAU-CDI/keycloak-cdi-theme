import { PageProps } from "keycloakify/login/pages/PageProps";
import { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import { CDIActions, CDIButton } from "../components/CDIButton";
import BoxedListItem from "../components/BoxedListItem";
import Collapsible from "../components/Collapsible";
import OauthGrantClientHeader from "../components/OauthGrantClientHeader";
import pageContent from "../components/PageContent.module.css";

export default function LoginOauthGrant(props: PageProps<Extract<KcContext, { pageId: "login-oauth-grant.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;
    const { url, oauth, client } = kcContext;

    const { msg, msgStr, advancedMsg, advancedMsgStr } = i18n;

    const applicationName = client.name ? advancedMsgStr(client.name) : client.clientId;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("cdiOauthGrantTitle", applicationName)}>
            <OauthGrantClientHeader logoUri={client.attributes.logoUri}>
                <strong>{applicationName}</strong> {msg("cdiOauthGrantIntroText")}
            </OauthGrantClientHeader>
            <Collapsible frozen defaultOpen={true} label={msg("cdiOauthGrantRequest")}>
                {oauth.clientScopesRequested.length > 0 ? (
                    <ul className={pageContent.stackedListPlain}>
                        {oauth.clientScopesRequested.map((clientScope, idx) => (
                            <BoxedListItem key={`${clientScope.consentScreenText}-${idx}`}>
                                <p className={pageContent.paragraphFlat}>
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
                <Collapsible label={msg("cdiOauthGrantInformation", applicationName)}>
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
                    <CDIButton as="input" type="submit" name="accept" value={msgStr("cdiOauthGrantAccept")} />
                    <CDIButton as="input" secondary type="submit" name="cancel" value={msgStr("cdiOauthGrantDeny")} />
                </CDIActions>
            </form>
        </CdiTemplate>
    );
}
