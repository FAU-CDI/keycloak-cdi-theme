import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import styles from "./LoginIdpLinkConfirm.module.css";

type LoginIdpLinkConfirmKcContext = Extract<KcContext, { pageId: "login-idp-link-confirm.ftl" }>;
type LoginIdpLinkConfirmProps = Omit<PageProps<LoginIdpLinkConfirmKcContext, I18n>, "Template">;

export default function LoginIdpLinkConfirm(props: LoginIdpLinkConfirmProps) {
    const { kcContext, i18n } = props;

    const { url, idpAlias, message } = kcContext;
    const { msg } = i18n;

    const messageNode = message ? <MessageAlert type={message.type} summary={message.summary} /> : null;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("confirmLinkIdpTitle")}>
            <form action={url.loginAction} method="post" className={styles.form}>
                {messageNode}
                <button type="submit" name="submitAction" value="linkAccount" data-action-button>
                    {msg("confirmLinkIdpContinue", idpAlias)}
                </button>
                <button type="submit" name="submitAction" value="updateProfile" data-second-button>
                    {msg("confirmLinkIdpReviewProfile")}
                </button>
            </form>
        </CdiTemplate>
    );
}
