import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import { CDIActions, CDIButton } from "../components/CDIButton";

export default function LoginPageExpired(props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;

    const { url } = kcContext;

    const { msg, msgStr } = i18n;

    const showMessage = kcContext.message !== undefined;
    const messageNode = showMessage && kcContext.message ? <MessageAlert type={kcContext.message.type} summary={kcContext.message.summary} /> : null;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("pageExpiredTitle")}>
            {messageNode}

            <CDIActions layout="rowWrap">
                <CDIButton as="a" href={url.loginRestartFlowUrl} role="button">
                    {msgStr("cdiRestartLoginProcess")}
                </CDIButton>
            </CDIActions>

            <CDIActions layout="rowWrap">
                <CDIButton as="a" secondary href={url.loginAction} role="button">
                    {msgStr("cdiContinueLoginProcess")}
                </CDIButton>
            </CDIActions>
        </CdiTemplate>
    );
}
