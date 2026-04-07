import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import styles from "./LoginIdpLinkConfirm.module.css";
import { CDIActions, CDIButton } from "../components/CDIButton";

type LoginIdpLinkConfirmKcContext = Extract<KcContext, { pageId: "login-idp-link-confirm.ftl" }>;
type LoginIdpLinkConfirmProps = Omit<PageProps<LoginIdpLinkConfirmKcContext, I18n>, "Template">;

export default function LoginIdpLinkConfirm(props: LoginIdpLinkConfirmProps) {
    const { kcContext, i18n } = props;

    const { url, idpAlias } = kcContext;
    const { msg } = i18n;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("confirmLinkIdpTitle")}>
            <form action={url.loginAction} method="post" className={styles.form}>
                <CDIActions>
                    <CDIButton type="submit" name="submitAction" value="linkAccount">
                        {msg("confirmLinkIdpContinue", idpAlias)}
                    </CDIButton>
                    <CDIButton secondary type="submit" name="submitAction" value="updateProfile">
                        {msg("confirmLinkIdpReviewProfile")}
                    </CDIButton>
                </CDIActions>
            </form>
        </CdiTemplate>
    );
}
