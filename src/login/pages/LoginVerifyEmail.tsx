import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
type LoginVerifyEmailKcContext = Extract<KcContext, { pageId: "login-verify-email.ftl" }>;
type LoginVerifyEmailProps = Omit<PageProps<LoginVerifyEmailKcContext, I18n>, "Template">;

export default function LoginVerifyEmail(props: LoginVerifyEmailProps) {
    const { kcContext, i18n } = props;

    const { msg } = i18n;

    const { url, user } = kcContext;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("emailVerifyTitle")}>
            <p>{msg("emailVerifyInstruction1", user?.email ?? "")}</p>
            <p>
                {msg("emailVerifyInstruction2")}
                <br />
                <a href={url.loginAction}>{msg("doClickHere")}</a>
                &nbsp;
                {msg("emailVerifyInstruction3")}
            </p>
            <p>
                {msg("cdiVerifyEmailSupport")}
            </p>
        </CdiTemplate>
    );
}
