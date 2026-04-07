import { useId, useState } from "react";
import { useScript as useWebAuthnConditionalLoginScript } from "keycloakify/login/pages/Login.useScript";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Collapsible from "./Collapsible";
import CdiTemplate from "./CdiTemplate";
import PasswordInputWithReveal from "./PasswordInputWithReveal";
import { CDIButton } from "./CDIButton";

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

export type CdiLoginPageProps = {
    kcContext: LoginishKcContext;
    i18n: I18n;
    variant: CdiLoginVariant;
    providersRequirePassword?: boolean;
    renderWebAuthnInsideNativeLogin?: boolean;
    webAuthnRequiresPasswordEnabled?: boolean;
};

export default function CdiLoginPage(props: CdiLoginPageProps) {
    const {
        kcContext,
        i18n,
        variant,
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
    const enableWebAuthnConditionalUI =
        "enableWebAuthnConditionalUI" in kcContext
            ? kcContext.enableWebAuthnConditionalUI
            : undefined;

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
        <WebAuthnConditionalLoginSection
            kcContext={kcContext}
            url={url}
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
            <CDIButton as="a" tabIndex={8} href={url.registrationUrl} role="button">
                {msgStr("doRegister")}
            </CDIButton>
        </Collapsible>
    ) : null;

    return (
        <CdiTemplate
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            headerNode={<HeaderNode realm={realm} />}
        >
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

function UsernameField(props: {
    variant: CdiLoginVariant;
    realm: RealmLike;
    login: LoginLike | undefined;
    usernameHidden?: boolean;
    enableWebAuthnConditionalUI?: boolean;
    hasFieldError: boolean;
    i18n: I18n;
}) {
    const {
        variant,
        realm,
        login,
        usernameHidden,
        enableWebAuthnConditionalUI,
        hasFieldError,
        i18n
    } = props;
    const { msg } = i18n;
    const usernameId = useId();

    if (variant === "password" || usernameHidden) {
        return null;
    }

    return (
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
    );
}

function RememberMeField(props: {
    variant: CdiLoginVariant;
    realm: RealmLike;
    login: LoginLike | undefined;
    usernameHidden?: boolean;
    i18n: I18n;
}) {
    const { variant, realm, login, usernameHidden, i18n } = props;
    const { msg } = i18n;
    const rememberMeId = useId();

    if (!realm.rememberMe || usernameHidden || variant === "password") {
        return null;
    }

    return (
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
    );
}

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

    const usernameField = (
        <UsernameField
            variant={variant}
            realm={realm}
            login={login}
            usernameHidden={usernameHidden}
            enableWebAuthnConditionalUI={enableWebAuthnConditionalUI}
            hasFieldError={hasFieldError}
            i18n={i18n}
        />
    );

    const passwordField =
        variant === "usernamePassword" || variant === "password" ? (
            <PasswordInputWithReveal
                hasFieldError={hasFieldError}
                i18n={i18n}
                tabIndex={variant === "password" ? 2 : 3}
            />
        ) : null;

    const rememberMe = (
        <RememberMeField
            variant={variant}
            realm={realm}
            login={login}
            usernameHidden={usernameHidden}
            i18n={i18n}
        />
    );

    const forgotPassword =
        realm.resetPasswordAllowed && url.loginResetCredentialsUrl ? (
            <a tabIndex={6} href={url.loginResetCredentialsUrl}>
                {msg("doForgotPassword")}
            </a>
        ) : null;

    const showRememberMe = realm.rememberMe && !usernameHidden && variant !== "password";

    const optionsRow =
        showRememberMe || forgotPassword !== null ? (
            <div className={styles.optionsRow}>
                {showRememberMe ? rememberMe : null}
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
                <CDIButton
                    as="input"
                    tabIndex={submitTabIndex}
                    disabled={isLoginButtonDisabled}
                    name="login"
                    type="submit"
                    value={msgStr("doLogIn")}
                />
            </div>
        </form>
    );
}

type WebAuthnConditionalLoginSectionProps = {
    kcContext: LoginishKcContext;
    url: { loginAction: string };
    authenticators?: WebAuthnAuthenticators;
    i18n: I18n;
};

function WebAuthnConditionalLoginSection(props: WebAuthnConditionalLoginSectionProps) {
    const { kcContext, url, authenticators, i18n } = props;
    const { msgStr } = i18n;

    const webAuthnButtonId = useId();
    useWebAuthnConditionalLoginScript({ webAuthnButtonId, kcContext, i18n });

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

            <CDIButton id={webAuthnButtonId} type="button">
                {msgStr("passkey-doAuthenticate")}
            </CDIButton>
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
                <CDIButton as="a" key={p.alias} href={p.loginUrl} role="button">
                    {msgStr("cdiSelectInstitutionWith", kcSanitize(p.displayName))}
                </CDIButton>
            ))}
        </div>
    );
}
