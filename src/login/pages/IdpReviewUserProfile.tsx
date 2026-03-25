import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import CdiUserProfileForm from "../components/CdiUserProfileForm";

type IdpReviewUserProfileKcContext = Extract<KcContext, { pageId: "idp-review-user-profile.ftl" }>;
type IdpReviewUserProfileProps = Omit<PageProps<IdpReviewUserProfileKcContext, I18n>, "Template">;

export default function IdpReviewUserProfile(props: IdpReviewUserProfileProps) {
    const { kcContext, i18n } = props;
    const { url, isAppInitiatedAction } = kcContext;
    const { msg } = i18n;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("loginIdpReviewProfileTitle")}>
            <CdiUserProfileForm
                action={url.loginAction}
                isAppInitiatedAction={isAppInitiatedAction}
                i18n={i18n}
                doMakeUserConfirmPassword={true}
                kcContext={kcContext}
            />
        </CdiTemplate>
    );
}
