/**
 * Login page (login.ftl): username/password + optional social providers.
 * Composes CdiTemplate with Collapsible sections. All Login UI in one file.
 */
import { useId, useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Collapsible from "../components/Collapsible";
import MessageAlert from "../components/MessageAlert";
import CdiTemplate from "../components/CdiTemplate";
import { useScript } from "keycloakify/login/pages/Login.useScript";

import styles from "./Login.module.css";

type LoginKcContext = Extract<KcContext, { pageId: "login.ftl" }>;
type LoginPageProps = Omit<PageProps<LoginKcContext, I18n>, "Template">;

/* ----- Types for inner components ----- */

type Realm = {
    password?: boolean;
    loginWithEmailAllowed?: boolean;
    registrationEmailAsUsername?: boolean;
    rememberMe?: boolean;
    resetPasswordAllowed?: boolean;
};

type MessagesPerField = {
    existsError: (...fields: string[]) => boolean;
    getFirstError: (...fields: string[]) => string;
};

type SocialProvider = {
    alias: string;
    displayName: string;
    loginUrl: string;
};

/* ----- Login page ----- */

export default function Login(props: LoginPageProps) {
    const { kcContext, i18n } = props;

    const { social, realm, url, usernameHidden, login, auth, message, isAppInitiatedAction, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    useScript({
        webAuthnButtonId: "",
        kcContext,
        i18n
    });

    const showMessage = message !== undefined && (message.type !== "warning" || !isAppInitiatedAction);

    const messageNode = showMessage && message ? <MessageAlert type={message.type} summary={message.summary} /> : null;

    const hasPrefilledOrError = !!login?.username?.trim() || messagesPerField.existsError("username", "password");

    const providersLogin =
        realm.password && social?.providers !== undefined && social.providers.length > 0 ? (
            <Collapsible label={msg("cdiSelectInstitution")} defaultOpen={!hasPrefilledOrError}>
                {messageNode}
                <p>{msg("cdiSelectInstitutionIntro")}</p>
                <SocialProviders providers={social.providers} msgStr={msgStr} />
            </Collapsible>
        ) : null;

    const nativeLogin = (
        <Collapsible label={msg("cdiGivenLocalAccount")} defaultOpen={hasPrefilledOrError}>
            <LoginForm
                realm={realm}
                url={url}
                login={login}
                auth={auth}
                usernameHidden={usernameHidden}
                messagesPerField={messagesPerField}
                i18n={i18n}
            />
        </Collapsible>
    );

    return (
        <CdiTemplate
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            displayMessage={true}
            headerNode={
                realm.displayNameHtml ? (
                    <span
                        dangerouslySetInnerHTML={{
                            __html: kcSanitize(realm.displayNameHtml)
                        }}
                    />
                ) : (
                    realm.displayName ?? realm.name
                )
            }
        >
            <p>{msg("cdiWelcomeText")}</p>
            {providersLogin}
            {nativeLogin}
        </CdiTemplate>
    );
}

/* ----- LoginForm (inline) ----- */

type LoginFormProps = {
    realm: Realm;
    url: { loginAction: string; loginResetCredentialsUrl: string };
    login: { username?: string; rememberMe?: boolean | string };
    auth: { selectedCredential?: string };
    usernameHidden?: boolean;
    messagesPerField: MessagesPerField;
    i18n: I18n;
};

function LoginForm(props: LoginFormProps) {
    const { realm, url, login, auth, usernameHidden, messagesPerField, i18n } = props;
    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const usernameId = useId();
    const passwordId = useId();
    const rememberMeId = useId();
    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({
        passwordInputId: passwordId
    });

    const hasFieldError = messagesPerField.existsError("username", "password");

    if (!realm.password) return null;

    return (
        <form
            className={styles.form}
            onSubmit={() => {
                setIsLoginButtonDisabled(true);
                return true;
            }}
            action={url.loginAction}
            method="post"
        >
            {hasFieldError && (
                <div
                    role="alert"
                    dangerouslySetInnerHTML={{
                        __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                    }}
                />
            )}
            {!usernameHidden && (
                <div>
                    <label htmlFor={usernameId}>
                        {!realm.loginWithEmailAllowed ? msg("username") : !realm.registrationEmailAsUsername ? msg("usernameOrEmail") : msg("email")}
                    </label>
                    <input
                        tabIndex={2}
                        id={usernameId}
                        name="username"
                        defaultValue={login.username ?? ""}
                        type="text"
                        autoFocus
                        autoComplete="username"
                        aria-invalid={hasFieldError}
                    />
                </div>
            )}

            <div>
                <label htmlFor={passwordId}>{msg("password")}</label>
                <div className={styles.passwordGroup} data-invalid={hasFieldError ? "true" : undefined}>
                    <input
                        tabIndex={3}
                        id={passwordId}
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        aria-invalid={hasFieldError}
                    />
                    <button
                        type="button"
                        aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                        aria-controls={passwordId}
                        onClick={toggleIsPasswordRevealed}
                    >
                        <i aria-hidden data-password-visibility-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")} />
                    </button>
                </div>
            </div>

            {(realm.rememberMe && !usernameHidden) || realm.resetPasswordAllowed ? (
                <div className={styles.optionsRow}>
                    {realm.rememberMe && !usernameHidden && (
                        <label htmlFor={rememberMeId}>
                            <input tabIndex={5} id={rememberMeId} name="rememberMe" type="checkbox" defaultChecked={!!login.rememberMe} />{" "}
                            {msg("rememberMe")}
                        </label>
                    )}
                    {realm.resetPasswordAllowed && (
                        <a tabIndex={6} href={url.loginResetCredentialsUrl}>
                            {msg("doForgotPassword")}
                        </a>
                    )}
                </div>
            ) : null}

            <div>
                <input type="hidden" name="credentialId" value={auth.selectedCredential ?? ""} />
                <input tabIndex={7} disabled={isLoginButtonDisabled} name="login" type="submit" value={msgStr("doLogIn")} data-action-button />
            </div>
        </form>
    );
}

/* ----- SocialProviders (inline) ----- */

type SocialProvidersProps = {
    providers: SocialProvider[];
    msgStr: I18n["msgStr"];
};

function SocialProviders(props: SocialProvidersProps) {
    const { providers, msgStr } = props;

    if (providers.length === 0) return null;

    return (
        <div className={styles.social}>
            {providers.map(p => (
                <a key={p.alias} href={p.loginUrl} role="button" data-action-button>
                    {msgStr("cdiSelectInstitutionWith", kcSanitize(p.displayName))}
                </a>
            ))}
        </div>
    );
}
