import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";

type ErrorKcContext = Extract<KcContext, { pageId: "error.ftl" }>;
type ErrorProps = Omit<PageProps<ErrorKcContext, I18n>, "Template">;

export default function Error(props: ErrorProps) {
    const { kcContext, i18n } = props;

    const { message, client, skipLink } = kcContext;
    const { msg } = i18n;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("errorTitle")}>
            {message && <MessageAlert type={message.type} summary={message.summary} />}
            {!skipLink && client?.baseUrl && (
                <div>
                    <a href={client.baseUrl} data-action-button>
                        {msg("backToApplication")}
                    </a>
                </div>
            )}
        </CdiTemplate>
    );
}
