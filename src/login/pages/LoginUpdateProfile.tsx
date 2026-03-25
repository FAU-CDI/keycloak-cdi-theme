import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import CdiUserProfileForm from "../components/CdiUserProfileForm";

type LoginUpdateProfileKcContext = Extract<KcContext, { pageId: "login-update-profile.ftl" }>;
type LoginUpdateProfileProps = Omit<PageProps<LoginUpdateProfileKcContext, I18n>, "Template">;

export default function LoginUpdateProfile(props: LoginUpdateProfileProps) {
    const { kcContext, i18n } = props;
    const { url, isAppInitiatedAction } = kcContext;
    const { msg } = i18n;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("loginProfileTitle")}>
            <CdiUserProfileForm
                action={url.loginAction}
                isAppInitiatedAction={isAppInitiatedAction}
                i18n={i18n}
                doMakeUserConfirmPassword={true}
                kcContext={kcContext}
                introNode={msg("cdiUpdateProfileIntro")}
            />
        </CdiTemplate>
    );
}
