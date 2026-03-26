import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";

type InfoKcContext = Extract<KcContext, { pageId: "info.ftl" }>;
type InfoProps = Omit<PageProps<InfoKcContext, I18n>, "Template">;

export default function Info(props: InfoProps) {
    const { kcContext, i18n } = props;

    const { advancedMsgStr, msg } = i18n;

    const { messageHeader, message, requiredActions, skipLink, pageRedirectUri, actionUri, client } = kcContext;

    const headerHtml = kcSanitize(messageHeader ? advancedMsgStr(messageHeader) : message?.summary ?? "");

    const messageType = message?.type ?? "info";

    const requiredActionsNode =
        requiredActions && requiredActions.length > 0 ? (
            <p>
                <strong>{requiredActions.map(requiredAction => advancedMsgStr(`requiredAction.${requiredAction}`)).join(", ")}</strong>
            </p>
        ) : null;

    const primaryActionNode = (() => {
        if (skipLink) return null;

        if (pageRedirectUri) {
            return (
                <a href={pageRedirectUri} data-action-button>
                    {msg("backToApplication")}
                </a>
            );
        }

        if (actionUri) {
            return (
                <a href={actionUri} data-action-button>
                    {msg("proceedWithAction")}
                </a>
            );
        }

        if (client?.baseUrl) {
            return (
                <a href={client.baseUrl} data-action-button>
                    {msg("backToApplication")}
                </a>
            );
        }

        return null;
    })();

    return (
        <CdiTemplate
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            displayMessage={false}
            headerNode={
                <span
                    dangerouslySetInnerHTML={{
                        __html: headerHtml
                    }}
                />
            }
        >
            {message && <MessageAlert type={messageType} summary={message.summary} />}
            {requiredActionsNode}

            {primaryActionNode && <div>{primaryActionNode}</div>}
        </CdiTemplate>
    );
}
