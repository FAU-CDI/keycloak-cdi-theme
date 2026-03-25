import { useId, type ComponentPropsWithoutRef } from "react";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import type { I18n } from "../i18n";

import styles from "./CdiLoginPage.module.css";

export type PasswordFieldWithRevealProps = {
    inputId: string;
    hasFieldError: boolean;
    i18n: I18n;
    inputProps: Omit<ComponentPropsWithoutRef<"input">, "id" | "type">;
};

/** Shared password row (input + reveal) for login and user-profile forms. */
export function PasswordFieldWithReveal(props: PasswordFieldWithRevealProps) {
    const { inputId, hasFieldError, i18n, inputProps } = props;
    const { msgStr } = i18n;

    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({
        passwordInputId: inputId
    });

    const ariaInvalid = inputProps["aria-invalid"] ?? hasFieldError;

    return (
        <div
            className={styles.passwordGroup}
            data-invalid={hasFieldError ? "true" : undefined}
        >
            <input
                {...inputProps}
                id={inputId}
                type={isPasswordRevealed ? "text" : "password"}
                aria-invalid={ariaInvalid}
            />
            <button
                type="button"
                className={styles.revealButton}
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={inputId}
                onClick={toggleIsPasswordRevealed}
            >
                {isPasswordRevealed ? <EyeOffIcon /> : <EyeIcon />}
            </button>
        </div>
    );
}

export default function PasswordInputWithReveal(props: {
    tabIndex: number;
    hasFieldError: boolean;
    i18n: I18n;
}) {
    const { tabIndex, hasFieldError, i18n } = props;
    const { msg } = i18n;

    const passwordId = useId();

    return (
        <div>
            <label htmlFor={passwordId}>{msg("password")}</label>
            <PasswordFieldWithReveal
                inputId={passwordId}
                hasFieldError={hasFieldError}
                i18n={i18n}
                inputProps={{
                    tabIndex,
                    name: "password",
                    autoComplete: "current-password",
                    "aria-invalid": hasFieldError
                }}
            />
        </div>
    );
}

function EyeIcon() {
    return (
        <svg
            className={styles.revealIcon}
            viewBox="0 0 24 24"
            aria-hidden
            focusable="false"
        >
            <path
                fill="currentColor"
                d="M12 5c-5.5 0-9.8 4.1-11 6.8a1.7 1.7 0 0 0 0 1.4C2.2 15.9 6.5 20 12 20s9.8-4.1 11-6.8a1.7 1.7 0 0 0 0-1.4C21.8 9.1 17.5 5 12 5zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8a3 3 0 1 0 .001 6.001A3 3 0 0 0 12 9z"
            />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg
            className={styles.revealIcon}
            viewBox="0 0 24 24"
            aria-hidden
            focusable="false"
        >
            <path
                fill="currentColor"
                d="M2.3 3.7 3.7 2.3 21.7 20.3 20.3 21.7l-2.2-2.2c-1.7.8-3.7 1.5-6.1 1.5-5.5 0-9.8-4.1-11-6.8a1.7 1.7 0 0 1 0-1.4c.8-1.8 2.6-4.1 5.3-5.6L2.3 3.7zM12 7c-.9 0-1.8.2-2.6.5l1.6 1.6c.3-.1.7-.1 1-.1 2.8 0 5 2.2 5 5 0 .3 0 .7-.1 1l1.6 1.6c.3-.8.5-1.7.5-2.6 0-3.9-3.1-7-7-7zm-7.4 5c1.2 2.3 4.3 6 9.4 6 1.8 0 3.3-.5 4.6-1.1l-1.7-1.7a4.98 4.98 0 0 1-6.1-6.1L8.9 7.2C6.6 8.5 5.3 10.5 4.6 12z"
            />
        </svg>
    );
}
