import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";

type LoginIdpLinkConfirmKcContext = Extract<KcContext, { pageId: "login-idp-link-confirm.ftl" }>;
type LoginIdpLinkConfirmProps = Omit<PageProps<LoginIdpLinkConfirmKcContext, I18n>, "Template">;

export default function LoginIdpLinkConfirm(props: LoginIdpLinkConfirmProps) {
    const { kcContext, i18n } = props;

    const { url, idpAlias } = kcContext;
    const { msg } = i18n;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("confirmLinkIdpTitle")}>
            <form action={url.loginAction} method="post">
                <div>
                    <button type="submit" name="submitAction" value="updateProfile" data-second-button>
                        {msg("confirmLinkIdpReviewProfile")}
                    </button>
                </div>
                &nbsp;
                <div>
                    <button type="submit" name="submitAction" value="linkAccount" data-action-button>
                        {msg("confirmLinkIdpContinue", idpAlias)}
                    </button>
                </div>
            </form>
        </CdiTemplate>
    );
}
