import { useId } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/LoginUsername.useScript";
import CdiLoginPage from "../components/CdiLoginPage";

type LoginUsernameKcContext = Extract<KcContext, { pageId: "login-username.ftl" }>;
type LoginUsernamePageProps = Omit<PageProps<LoginUsernameKcContext, I18n>, "Template">;

export default function LoginUsername(props: LoginUsernamePageProps) {
    const { kcContext, i18n } = props;

    const webAuthnButtonId = useId();

    useScript({
        webAuthnButtonId,
        kcContext,
        i18n
    });

    return (
        <CdiLoginPage
            kcContext={kcContext}
            i18n={i18n}
            variant="username"
            webAuthnButtonId={webAuthnButtonId}
            renderWebAuthnInsideNativeLogin={false}
            providersRequirePassword={true}
            webAuthnRequiresPasswordEnabled={false}
        />
    );
}
