/**
 * Login page (login.ftl): username/password + optional social providers.
 * Composes CdiTemplate with Collapsible sections. All Login UI in one file.
 */
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import CdiLoginPage from "../components/CdiLoginPage";

type LoginKcContext = Extract<KcContext, { pageId: "login.ftl" }>;
type LoginPageProps = Omit<PageProps<LoginKcContext, I18n>, "Template">;

/* ----- Login page ----- */

export default function Login(props: LoginPageProps) {
    const { kcContext, i18n } = props;

    return <CdiLoginPage kcContext={kcContext} i18n={i18n} variant="usernamePassword" renderWebAuthnInsideNativeLogin={true} />;
}
