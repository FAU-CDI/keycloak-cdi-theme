import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import { CDIActions, CDIButton } from "../components/CDIButton";

import styles from "../components/CdiLoginPage.module.css";
import pageContent from "../components/PageContent.module.css";

export default function LoginX509Info(props: PageProps<Extract<KcContext, { pageId: "login-x509-info.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;

    const { url, x509 } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("doLogIn")}>
            <form id="kc-x509-login-info" className={styles.form} action={url.loginAction} method="post">
                <div>
                    <label>{msg("clientCertificate")}</label>
                    <p className={pageContent.x509Value}>{x509.formData.subjectDN ? x509.formData.subjectDN : msg("noCertificate")}</p>
                </div>

                {x509.formData.isUserEnabled && (
                    <div>
                        <label>{msg("doX509Login")}</label>
                        <p className={pageContent.x509Value}>{x509.formData.username}</p>
                    </div>
                )}

                <CDIActions layout={x509.formData.isUserEnabled ? "rowWrap" : undefined}>
                    <CDIButton as="input" name="login" id="kc-login" type="submit" value={msgStr("doContinue")} />
                    {x509.formData.isUserEnabled && (
                        <CDIButton as="input" secondary name="cancel" id="kc-cancel" type="submit" value={msgStr("doIgnore")} />
                    )}
                </CDIActions>
            </form>
        </CdiTemplate>
    );
}
