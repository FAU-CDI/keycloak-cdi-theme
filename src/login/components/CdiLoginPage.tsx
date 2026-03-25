import { useId, useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Collapsible from "./Collapsible";
import MessageAlert from "./MessageAlert";
import CdiTemplate from "./CdiTemplate";

import styles from "./CdiLoginPage.module.css";

export type CdiLoginVariant = "username" | "usernamePassword" | "password";

type LoginishKcContext = Extract<
    KcContext,
    { pageId: "login.ftl" | "login-username.ftl" | "login-password.ftl" }
>;

type RealmLike = {
    name: string;
    displayName?: string;
    displayNameHtml?: string;
    password?: boolean;
    loginWithEmailAllowed?: boolean;
    registrationEmailAsUsername?: boolean;
    rememberMe?: boolean;
    resetPasswordAllowed?: boolean;
    registrationAllowed?: boolean;
};

type UrlLike = {
    loginAction: string;
    registrationUrl?: string;
    loginResetCredentialsUrl?: string;
};

type LoginLike = {
    username?: string;
    rememberMe?: boolean | string;
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

type WebAuthnAuthenticators = {
    authenticators: { credentialId: string }[];
};

type KcMessage = {
    type: "success" | "warning" | "error" | "info";
    summary: string;
};

export type CdiLoginPageProps = {
    kcContext: LoginishKcContext;
    i18n: I18n;
    variant: CdiLoginVariant;
    webAuthnButtonId: string;
    providersRequirePassword?: boolean;
    renderWebAuthnInsideNativeLogin?: boolean;
    webAuthnRequiresPasswordEnabled?: boolean;
};

export default function CdiLoginPage(props: CdiLoginPageProps) {
    const {
        kcContext,
        i18n,
        variant,
        webAuthnButtonId,
        providersRequirePassword = false,
        renderWebAuthnInsideNativeLogin = false,
        webAuthnRequiresPasswordEnabled = true
    } = props;

    const { msg, msgStr } = i18n;

    const realm = kcContext.realm as RealmLike;
    const url = kcContext.url as UrlLike;
    const login = ("login" in kcContext ? kcContext.login : undefined) as
        | LoginLike
        | undefined;
    const auth = kcContext.pageId === "login.ftl" ? kcContext.auth : undefined;
    const usernameHidden =
        "usernameHidden" in kcContext ? kcContext.usernameHidden : undefined;
    const messagesPerField = kcContext.messagesPerField as MessagesPerField;
    const socialProviders =
        "social" in kcContext
            ? (kcContext.social?.providers as SocialProvider[] | undefined) ?? undefined
            : undefined;
    const authenticators =
        "authenticators" in kcContext
            ? (kcContext.authenticators as WebAuthnAuthenticators | undefined)
            : undefined;
    const registrationDisabled =
        "registrationDisabled" in kcContext ? kcContext.registrationDisabled : false;
    const message = ("message" in kcContext ? kcContext.message : undefined) as
        | KcMessage
        | undefined;
    const isAppInitiatedAction = (
        "isAppInitiatedAction" in kcContext ? kcContext.isAppInitiatedAction : undefined
    ) as boolean | undefined;
    const enableWebAuthnConditionalUI =
        "enableWebAuthnConditionalUI" in kcContext
            ? kcContext.enableWebAuthnConditionalUI
            : undefined;

    const showMessage =
        message !== undefined && (message.type !== "warning" || !isAppInitiatedAction);
    const messageNode =
        showMessage && message ? (
            <MessageAlert type={message.type} summary={message.summary} />
        ) : null;

    const errorFields =
        variant === "usernamePassword"
            ? ["username", "password"]
            : variant === "username"
              ? ["username"]
              : ["password"];

    const hasSocialProviders =
        socialProviders !== undefined && socialProviders.length > 0;
    const hasPrefilledOrError =
        !!login?.username?.trim() || messagesPerField.existsError(...errorFields);
    const defaultIsSSO = hasSocialProviders && !hasPrefilledOrError;

    const showProvidersSection =
        hasSocialProviders && (!providersRequirePassword || !!realm.password);

    const providersLogin =
        showProvidersSection &&
        socialProviders !== undefined &&
        socialProviders.length > 0 ? (
            <Collapsible label={msg("cdiSelectInstitution")} defaultOpen={defaultIsSSO}>
                <p>{msg("cdiSelectInstitutionIntro")}</p>
                <SocialProviders providers={socialProviders} msgStr={msgStr} />
            </Collapsible>
        ) : null;

    const isPasswordEnabled = realm.password !== false;
    const showWebAuthnConditionalSection =
        !!enableWebAuthnConditionalUI &&
        (!webAuthnRequiresPasswordEnabled || isPasswordEnabled);

    const webAuthnConditionalSection = showWebAuthnConditionalSection ? (
        <WebAuthnConditionalSection
            url={url}
            webAuthnButtonId={webAuthnButtonId}
            authenticators={authenticators}
            i18n={i18n}
        />
    ) : null;

    const showNativeLogin = variant === "password" ? true : !!realm.password;
    const nativeLogin = showNativeLogin ? (
        <Collapsible label={msg("cdiGivenLocalAccount")} defaultOpen={!defaultIsSSO}>
            <LoginForm
                variant={variant}
                realm={realm}
                url={url}
                login={login}
                auth={auth}
                usernameHidden={usernameHidden}
                enableWebAuthnConditionalUI={showWebAuthnConditionalSection}
                messagesPerField={messagesPerField}
                i18n={i18n}
            />
            {renderWebAuthnInsideNativeLogin ? webAuthnConditionalSection : null}
        </Collapsible>
    ) : null;

    const showRegister =
        variant !== "password" &&
        !!realm.password &&
        !!realm.registrationAllowed &&
        !registrationDisabled &&
        !!url.registrationUrl;
    const register = showRegister ? (
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
            headerNode={<HeaderNode realm={realm} />}
        >
            {messageNode}
            <p>{msg("cdiWelcomeText")}</p>
            {providersLogin}
            {nativeLogin}
            {renderWebAuthnInsideNativeLogin ? null : webAuthnConditionalSection}
            {register}
        </CdiTemplate>
    );
}

function HeaderNode(props: { realm: RealmLike }) {
    const { realm } = props;

    if (realm.displayNameHtml) {
        return (
            <span
                dangerouslySetInnerHTML={{
                    __html: kcSanitize(realm.displayNameHtml)
                }}
            />
        );
    }

    return <>{realm.displayName ?? realm.name}</>;
}

type LoginFormProps = {
    variant: CdiLoginVariant;
    realm: RealmLike;
    url: UrlLike;
    login: LoginLike | undefined;
    auth?: { selectedCredential?: string };
    usernameHidden?: boolean;
    enableWebAuthnConditionalUI?: boolean;
    messagesPerField: MessagesPerField;
    i18n: I18n;
};

function LoginForm(props: LoginFormProps) {
    const {
        variant,
        realm,
        url,
        login,
        auth,
        usernameHidden,
        enableWebAuthnConditionalUI,
        messagesPerField,
        i18n
    } = props;
    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const usernameId = useId();
    const rememberMeId = useId();

    const hasFieldError =
        variant === "usernamePassword"
            ? messagesPerField.existsError("username", "password")
            : variant === "username"
              ? messagesPerField.existsError("username")
              : messagesPerField.existsError("password");

    const errorFields =
        variant === "usernamePassword"
            ? ["username", "password"]
            : variant === "username"
              ? ["username"]
              : ["password"];

    const usernameField =
        variant !== "password" && !usernameHidden ? (
            <div>
                <label htmlFor={usernameId}>
                    {!realm.loginWithEmailAllowed
                        ? msg("username")
                        : !realm.registrationEmailAsUsername
                          ? msg("usernameOrEmail")
                          : msg("email")}
                </label>
                <input
                    tabIndex={2}
                    id={usernameId}
                    name="username"
                    defaultValue={login?.username ?? ""}
                    type="text"
                    autoFocus
                    autoComplete={
                        enableWebAuthnConditionalUI ? "username webauthn" : "username"
                    }
                    aria-invalid={hasFieldError}
                />
            </div>
        ) : null;

    const passwordField =
        variant === "usernamePassword" || variant === "password" ? (
            <PasswordField
                hasFieldError={hasFieldError}
                msgStr={msgStr}
                msg={msg}
                tabIndex={variant === "password" ? 2 : 3}
            />
        ) : null;

    const rememberMe =
        realm.rememberMe && !usernameHidden && variant !== "password" ? (
            <label htmlFor={rememberMeId}>
                <input
                    tabIndex={variant === "usernamePassword" ? 5 : 3}
                    id={rememberMeId}
                    name="rememberMe"
                    type="checkbox"
                    defaultChecked={!!login?.rememberMe}
                />{" "}
                {msg("rememberMe")}
            </label>
        ) : null;

    const forgotPassword =
        realm.resetPasswordAllowed && url.loginResetCredentialsUrl ? (
            <a tabIndex={6} href={url.loginResetCredentialsUrl}>
                {msg("doForgotPassword")}
            </a>
        ) : null;

    const optionsRow =
        rememberMe !== null || forgotPassword !== null ? (
            <div className={styles.optionsRow}>
                {rememberMe}
                {forgotPassword}
            </div>
        ) : null;

    const submitTabIndex =
        variant === "usernamePassword" ? 7 : variant === "username" ? 4 : 3;

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
                        __html: kcSanitize(messagesPerField.getFirstError(...errorFields))
                    }}
                />
            )}

            {usernameField}
            {passwordField}
            {optionsRow}

            <div>
                {auth?.selectedCredential !== undefined && (
                    <input
                        type="hidden"
                        name="credentialId"
                        value={auth.selectedCredential ?? ""}
                    />
                )}
                <input
                    tabIndex={submitTabIndex}
                    disabled={isLoginButtonDisabled}
                    name="login"
                    type="submit"
                    value={msgStr("doLogIn")}
                    data-action-button
                />
            </div>
        </form>
    );
}

function PasswordField(props: {
    hasFieldError: boolean;
    msg: I18n["msg"];
    msgStr: I18n["msgStr"];
    tabIndex: number;
}) {
    const { hasFieldError, msg, msgStr, tabIndex } = props;

    const passwordId = useId();

    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({
        passwordInputId: passwordId
    });

    return (
        <div>
            <label htmlFor={passwordId}>{msg("password")}</label>
            <div
                className={styles.passwordGroup}
                data-invalid={hasFieldError ? "true" : undefined}
            >
                <input
                    tabIndex={tabIndex}
                    id={passwordId}
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    aria-invalid={hasFieldError}
                />
                <button
                    type="button"
                    aria-label={msgStr(
                        isPasswordRevealed ? "hidePassword" : "showPassword"
                    )}
                    aria-controls={passwordId}
                    onClick={toggleIsPasswordRevealed}
                >
                    <i
                        aria-hidden
                        data-password-visibility-label={msgStr(
                            isPasswordRevealed ? "hidePassword" : "showPassword"
                        )}
                    />
                </button>
            </div>
        </div>
    );
}

type WebAuthnConditionalSectionProps = {
    url: { loginAction: string };
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

            {authenticators !== undefined &&
                authenticators.authenticators.length !== 0 && (
                    <form id="authn_select">
                        {authenticators.authenticators.map((authenticator, index) => (
                            <input
                                key={index}
                                type="hidden"
                                name="authn_use_chk"
                                readOnly
                                value={authenticator.credentialId}
                            />
                        ))}
                    </form>
                )}

            <button id={webAuthnButtonId} type="button" data-action-button>
                {msgStr("passkey-doAuthenticate")}
            </button>
        </>
    );
}

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
