import { useId } from "react";
import { PageProps } from "keycloakify/login/pages/PageProps";
import { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import { CDIActions, CDIButton } from "../components/CDIButton";

import styles from "../components/CdiLoginPage.module.css";

export default function LoginOauth2DeviceVerifyUserCode(
    props: PageProps<Extract<KcContext, { pageId: "login-oauth2-device-verify-user-code.ftl" }>, I18n>
) {
    const { kcContext, i18n } = props;
    const { url, message } = kcContext;

    const { msg, msgStr } = i18n;

    const userCodeInputId = useId();

    const showMessage = message !== undefined;
    const messageNode = showMessage && message ? <MessageAlert type={message.type} summary={message.summary} /> : null;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} headerNode={msg("oauth2DeviceVerificationTitle")}>
            {messageNode}

            <form className={styles.form} action={url.oauth2DeviceVerificationAction} method="post">
                <div>
                    <label htmlFor={userCodeInputId}>{msg("verifyOAuth2DeviceUserCode")}</label>
                    <input id={userCodeInputId} name="device_user_code" autoComplete="off" type="text" autoFocus />
                </div>

                <CDIActions layout="rowWrap">
                    <CDIButton as="input" type="submit" value={msgStr("doSubmit")} />
                </CDIActions>
            </form>
        </CdiTemplate>
    );
}
