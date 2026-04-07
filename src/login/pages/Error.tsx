import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import { CDIButton } from "../components/CDIButton";

type ErrorKcContext = Extract<KcContext, { pageId: "error.ftl" }>;
type ErrorProps = Omit<PageProps<ErrorKcContext, I18n>, "Template">;

export default function Error(props: ErrorProps) {
    const { kcContext, i18n } = props;

    const { client, skipLink } = kcContext;
    const { msg } = i18n;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("errorTitle")}>
            {!skipLink && client?.baseUrl && (
                <div>
                    <CDIButton as="a" href={client.baseUrl}>
                        {msg("backToApplication")}
                    </CDIButton>
                </div>
            )}
        </CdiTemplate>
    );
}
