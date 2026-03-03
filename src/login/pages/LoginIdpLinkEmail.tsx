import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";

type LoginIdpLinkEmailKcContext = Extract<KcContext, { pageId: "login-idp-link-email.ftl" }>;
type LoginIdpLinkEmailProps = Omit<PageProps<LoginIdpLinkEmailKcContext, I18n>, "Template">;

export default function LoginIdpLinkEmail(props: LoginIdpLinkEmailProps) {
    const { kcContext, i18n } = props;

    const { url, realm, brokerContext, idpAlias, message } = kcContext;
    const { msg } = i18n;

    const messageNode = message ? <MessageAlert type={message.type} summary={message.summary} /> : null;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("emailLinkIdpTitle", idpAlias)}>
            {messageNode}
            <p>{msg("emailLinkIdp1", idpAlias, brokerContext.username, realm.displayName)}</p>
            <p>
                {msg("emailLinkIdp2")} <a href={url.loginAction}>{msg("doClickHere")}</a> {msg("emailLinkIdp3")}
            </p>
            <p>
                {msg("emailLinkIdp4")} <a href={url.loginAction}>{msg("doClickHere")}</a> {msg("emailLinkIdp5")}
            </p>
        </CdiTemplate>
    );
}
