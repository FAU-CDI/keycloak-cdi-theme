import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import { CDIActions, CDIButton } from "../components/CDIButton";

type LoginIdpLinkConfirmOverrideKcContext = Extract<KcContext, { pageId: "login-idp-link-confirm-override.ftl" }>;
type LoginIdpLinkConfirmOverrideProps = Omit<PageProps<LoginIdpLinkConfirmOverrideKcContext, I18n>, "Template">;

export default function LoginIdpLinkConfirmOverride(props: LoginIdpLinkConfirmOverrideProps) {
    const { kcContext, i18n } = props;

    const { url, idpDisplayName } = kcContext;

    const { msg } = i18n;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("confirmOverrideIdpTitle")}>
            <p>
                {msg("pageExpiredMsg1")} <a href={url.loginRestartFlowUrl}>{msg("doClickHere")}</a>
            </p>

            <form action={url.loginAction} method="post">
                <CDIActions>
                    <CDIButton type="submit" name="submitAction" value="confirmOverride">
                        {msg("confirmOverrideIdpContinue", idpDisplayName)}
                    </CDIButton>
                </CDIActions>
            </form>
        </CdiTemplate>
    );
}
