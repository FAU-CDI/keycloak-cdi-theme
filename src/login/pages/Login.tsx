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

    const {
        social,
        realm,
        url,
        usernameHidden,
        login,
        auth,
        message,
        isAppInitiatedAction,
        messagesPerField,
        enableWebAuthnConditionalUI,
        registrationDisabled,
        authenticators
    } = kcContext;

    const { msg, msgStr } = i18n;

    const webAuthnButtonId = useId();
    const isPasswordEnabled = realm.password !== false;

    useScript({
        webAuthnButtonId,
        kcContext,
        i18n
    });

    const showMessage = message !== undefined && (message.type !== "warning" || !isAppInitiatedAction);

    const messageNode = showMessage && message ? <MessageAlert type={message.type} summary={message.summary} /> : null;

    const hasSocialProviders = social?.providers !== undefined && social.providers.length > 0;
    const hasPrefilledOrError = !!login?.username?.trim() || messagesPerField.existsError("username", "password");
    const defaultIsSSO = hasSocialProviders && !hasPrefilledOrError;

    const providersLogin =
        social?.providers !== undefined && social.providers.length > 0 ? (
            <Collapsible label={msg("cdiSelectInstitution")} defaultOpen={defaultIsSSO}>
                <p>{msg("cdiSelectInstitutionIntro")}</p>
                <SocialProviders providers={social.providers} msgStr={msgStr} />
            </Collapsible>
        ) : null;

    const webAuthnConditionalSection =
        isPasswordEnabled && enableWebAuthnConditionalUI ? (
            <WebAuthnConditionalSection url={url} webAuthnButtonId={webAuthnButtonId} authenticators={authenticators} i18n={i18n} />
        ) : null;
    const nativeLogin = realm.password ? (
        <Collapsible label={msg("cdiGivenLocalAccount")} defaultOpen={!defaultIsSSO}>
            <LoginForm
                realm={realm}
                url={url}
                login={login}
                auth={auth}
                usernameHidden={usernameHidden}
                enableWebAuthnConditionalUI={enableWebAuthnConditionalUI}
                messagesPerField={messagesPerField}
                i18n={i18n}
                passwordEnabled={isPasswordEnabled}
            />
            {webAuthnConditionalSection}
        </Collapsible>
    ) : null;

    const register =
        realm.password && realm.registrationAllowed && !registrationDisabled ? (
            <Collapsible label={msgStr("noAccount")} defaultOpen={false}>
                <a tabIndex={8} href={url.registrationUrl} data-action-button role="button">
                    {msgStr("doRegister")}
                </a>
            </Collapsible>
        ) : null;

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
            {messageNode}
            <p>{msg("cdiWelcomeText")}</p>
            {providersLogin}
            {nativeLogin}
            {register}
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
    enableWebAuthnConditionalUI?: boolean;
    messagesPerField: MessagesPerField;
    i18n: I18n;
    passwordEnabled: boolean;
};

function LoginForm(props: LoginFormProps) {
    const { realm, url, login, auth, usernameHidden, enableWebAuthnConditionalUI, messagesPerField, i18n } = props;
    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const usernameId = useId();
    const passwordId = useId();
    const rememberMeId = useId();

    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({
        passwordInputId: passwordId
    });

    const hasFieldError = messagesPerField.existsError("username", "password");

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
                        autoComplete={enableWebAuthnConditionalUI ? "username webauthn" : "username"}
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

type WebAuthnAuthenticators = {
    authenticators: { credentialId: string }[];
};

type WebAuthnConditionalSectionProps = {
    url: LoginFormProps["url"];
    webAuthnButtonId: string;
    authenticators?: WebAuthnAuthenticators;
    i18n: I18n;
};

function WebAuthnConditionalSection(props: WebAuthnConditionalSectionProps) {
    const { url, webAuthnButtonId, authenticators, i18n } = props;
    const { msgStr } = i18n;

    return (
        <>
            <form id="webauth" action={url.loginAction} method="post">
                <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                <input type="hidden" id="authenticatorData" name="authenticatorData" />
                <input type="hidden" id="signature" name="signature" />
                <input type="hidden" id="credentialId" name="credentialId" />
                <input type="hidden" id="userHandle" name="userHandle" />
                <input type="hidden" id="error" name="error" />
            </form>

            {authenticators !== undefined && authenticators.authenticators.length !== 0 && (
                <form id="authn_select">
                    {authenticators.authenticators.map((authenticator, index) => (
                        <input key={index} type="hidden" name="authn_use_chk" readOnly value={authenticator.credentialId} />
                    ))}
                </form>
            )}

            <button id={webAuthnButtonId} type="button" data-action-button>
                {msgStr("passkey-doAuthenticate")}
            </button>
        </>
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
