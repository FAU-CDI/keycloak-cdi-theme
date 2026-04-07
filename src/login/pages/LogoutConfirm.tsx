import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import { CDIActions, CDIButton } from "../components/CDIButton";
import pageContent from "../components/PageContent.module.css";

export default function LogoutConfirm(props: PageProps<Extract<KcContext, { pageId: "logout-confirm.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;

    const { url, client, logoutConfirm } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("logoutConfirmTitle")}>
            <p className={pageContent.proseAfterHeader}>{msg("logoutConfirmHeader")}</p>

            <form action={url.logoutConfirmAction} method="POST">
                <input type="hidden" name="session_code" value={logoutConfirm.code} />
                <CDIActions layout="rowWrap">
                    <CDIButton as="input" tabIndex={4} name="confirmLogout" id="kc-logout" type="submit" value={msgStr("doLogout")} />
                    {!logoutConfirm.skipLink && client.baseUrl ? (
                        <CDIButton as="a" href={client.baseUrl} secondary>
                            {msg("backToApplication")}
                        </CDIButton>
                    ) : null}
                </CDIActions>
            </form>
        </CdiTemplate>
    );
}
