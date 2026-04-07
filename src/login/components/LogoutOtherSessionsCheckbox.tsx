import type { I18n } from "../i18n";
import pageContent from "./PageContent.module.css";

export type LogoutOtherSessionsCheckboxProps = {
    i18n: I18n;
    /** Defaults to `logout-sessions` (Keycloak field name). */
    inputId?: string;
    /** Optional wrapper id (e.g. `kc-form-options`). */
    wrapperId?: string;
    /** If true, only the checkbox row is rendered (no outer spacing wrapper). */
    omitOuterWrapper?: boolean;
};

/**
 * “Sign out from other devices” checkbox used on password update, email update, recovery codes, etc.
 */
export default function LogoutOtherSessionsCheckbox(
    props: LogoutOtherSessionsCheckboxProps
) {
    const {
        i18n,
        inputId = "logout-sessions",
        wrapperId,
        omitOuterWrapper = false
    } = props;
    const { msg } = i18n;

    const row = (
        <label className={pageContent.inlineCheckboxRow} htmlFor={inputId}>
            <input
                type="checkbox"
                id={inputId}
                name="logout-sessions"
                value="on"
                defaultChecked={true}
            />
            <span>{msg("logoutOtherSessions")}</span>
        </label>
    );

    if (omitOuterWrapper) {
        return row;
    }

    return (
        <div id={wrapperId} className={pageContent.formBlockVertical}>
            {row}
        </div>
    );
}
