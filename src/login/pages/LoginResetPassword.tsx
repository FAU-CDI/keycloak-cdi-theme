import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import styles from "../components/CdiLoginPage.module.css";

type LoginResetPasswordKcContext = Extract<KcContext, { pageId: "login-reset-password.ftl" }>;
type LoginResetPasswordProps = Omit<PageProps<LoginResetPasswordKcContext, I18n>, "Template">;

export default function LoginResetPassword(props: LoginResetPasswordProps) {
    const { kcContext, i18n } = props;

    const { url, realm, auth, messagesPerField, message } = kcContext;

    const { msg, msgStr } = i18n;

    const showUsernameError = messagesPerField.existsError("username");
    const usernameError = showUsernameError ? messagesPerField.get("username") : undefined;

    return (
        <CdiTemplate
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            displayMessage={!showUsernameError}
            headerNode={msg("emailForgotTitle")}
        >
            {message && <MessageAlert type={message.type} summary={message.summary} />}

            <p>{realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")}</p>

            <form id="kc-reset-password-form" className={styles.form} action={url.loginAction} method="post">
                <div>
                    <label htmlFor="username">
                        {!realm.loginWithEmailAllowed ? msg("username") : !realm.registrationEmailAsUsername ? msg("usernameOrEmail") : msg("email")}
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        autoFocus
                        defaultValue={auth.attemptedUsername ?? ""}
                        aria-invalid={showUsernameError}
                        aria-describedby={showUsernameError ? "input-error-username" : undefined}
                    />
                    {showUsernameError && usernameError !== undefined && (
                        <div id="input-error-username" role="alert" dangerouslySetInnerHTML={{ __html: kcSanitize(usernameError) }} />
                    )}
                </div>

                <div>
                    <a href={url.loginUrl} data-second-button role="button">
                        {msg("backToLogin")}
                    </a>
                </div>

                <div>
                    <button type="submit" data-action-button>
                        {msgStr("doSubmit")}
                    </button>
                </div>
            </form>
        </CdiTemplate>
    );
}
