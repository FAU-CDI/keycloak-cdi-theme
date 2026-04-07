import type { JSX } from "keycloakify/tools/JSX";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import CdiUserProfileForm from "../components/CdiUserProfileForm";
import LogoutOtherSessionsCheckbox from "../components/LogoutOtherSessionsCheckbox";

type UpdateEmailProps = PageProps<Extract<KcContext, { pageId: "update-email.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function UpdateEmail(props: UpdateEmailProps) {
    const { kcContext, i18n, doMakeUserConfirmPassword } = props;

    const { url, isAppInitiatedAction } = kcContext;

    const { msg } = i18n;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("updateEmailTitle")}>
            <CdiUserProfileForm
                formId="kc-update-email-form"
                action={url.loginAction}
                isAppInitiatedAction={isAppInitiatedAction}
                i18n={i18n}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                kcContext={kcContext}
                footerNode={<LogoutOtherSessionsCheckbox i18n={i18n} />}
            />
        </CdiTemplate>
    );
}
