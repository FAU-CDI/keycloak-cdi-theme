/**
 * Password step (login-password.ftl) for flows where username is already captured.
 * Adds conditional WebAuthn passkey authenticate section when enabled.
 */
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiLoginPage from "../components/CdiLoginPage";

type LoginPasswordKcContext = Extract<KcContext, { pageId: "login-password.ftl" }>;
type LoginPasswordPageProps = Omit<PageProps<LoginPasswordKcContext, I18n>, "Template">;

export default function LoginPassword(props: LoginPasswordPageProps) {
    const { kcContext, i18n } = props;

    return (
        <CdiLoginPage
            kcContext={kcContext}
            i18n={i18n}
            variant="password"
            renderWebAuthnInsideNativeLogin={false}
            webAuthnRequiresPasswordEnabled={false}
        />
    );
}
