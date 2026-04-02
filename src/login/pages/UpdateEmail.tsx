import type { JSX } from "keycloakify/tools/JSX";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import CdiUserProfileForm from "../components/CdiUserProfileForm";

type UpdateEmailProps = PageProps<Extract<KcContext, { pageId: "update-email.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function UpdateEmail(props: UpdateEmailProps) {
    const { kcContext, i18n, doMakeUserConfirmPassword } = props;

    const { url, isAppInitiatedAction } = kcContext;

    const { msg } = i18n;

    const showMessage = kcContext.message !== undefined;
    const messageNode = showMessage && kcContext.message ? <MessageAlert type={kcContext.message.type} summary={kcContext.message.summary} /> : null;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("updateEmailTitle")}>
            {messageNode}

            <CdiUserProfileForm
                formId="kc-update-email-form"
                action={url.loginAction}
                isAppInitiatedAction={isAppInitiatedAction}
                i18n={i18n}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                kcContext={kcContext}
                footerNode={<LogoutOtherSessions i18n={i18n} />}
            />
        </CdiTemplate>
    );
}

function LogoutOtherSessions(props: { i18n: I18n }) {
    const { i18n } = props;
    const { msg } = i18n;

    return (
        <div style={{ margin: "1rem 0" }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" defaultChecked={true} />
                <span>{msg("logoutOtherSessions")}</span>
            </label>
        </div>
    );
}
