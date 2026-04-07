import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import { CDIActions, CDIButton } from "../components/CDIButton";
import BoxedListItem from "../components/BoxedListItem";
import Collapsible from "../components/Collapsible";

import formStyles from "../components/CdiLoginPage.module.css";
import styles from "./LoginConfigTotp.module.css";

type LoginConfigTotpKcContext = Extract<KcContext, { pageId: "login-config-totp.ftl" }>;
type LoginConfigTotpProps = Omit<PageProps<LoginConfigTotpKcContext, I18n>, "Template">;

const TOTP_APP_SUGGESTIONS: { label: string; href: string }[] = [
    { label: "FreeOTP", href: "https://freeotp.github.io" },
    { label: "KeePassXC", href: "https://keepassxc.org" }
];

export default function LoginConfigTotp(props: LoginConfigTotpProps) {
    const { kcContext, i18n } = props;

    const { url, totp, mode, messagesPerField, isAppInitiatedAction } = kcContext;

    const { msg, msgStr } = i18n;

    const totpError = messagesPerField.existsError("totp") ? messagesPerField.get("totp") : "";
    const userLabelError = messagesPerField.existsError("userLabel") ? messagesPerField.get("userLabel") : "";

    return (
        <CdiTemplate
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            displayMessage={!messagesPerField.existsError("totp", "userLabel")}
            headerNode={msg("loginTotpTitle")}
        >
            <ol className={styles.steps}>
                <BoxedListItem>
                    <p>{msg("loginTotpStep1")}</p>
                    <ul className={styles.apps}>
                        {TOTP_APP_SUGGESTIONS.map(app => (
                            <li key={app.href}>
                                <a href={app.href} target="_blank" rel="noreferrer">
                                    {app.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </BoxedListItem>

                {mode === "manual" ? (
                    <>
                        <BoxedListItem>
                            <p>{msg("loginTotpManualStep2")}</p>
                            <p className={styles.secretRow}>
                                <code className={styles.secret}>{totp.totpSecretEncoded}</code>
                            </p>
                            <p>
                                <a href={totp.qrUrl}>{msg("loginTotpScanBarcode")}</a>
                            </p>
                        </BoxedListItem>
                        <BoxedListItem>
                            <Collapsible frozen defaultOpen={true} label={msg("loginTotpManualStep3")}>
                                <ul className={styles.policyList}>
                                    <li>
                                        {msg("loginTotpType")}: {msg(`loginTotp.${totp.policy.type}`)}
                                    </li>
                                    <li>
                                        {msg("loginTotpAlgorithm")}: {totp.policy.getAlgorithmKey()}
                                    </li>
                                    <li>
                                        {msg("loginTotpDigits")}: {totp.policy.digits}
                                    </li>
                                    {totp.policy.type === "totp" ? (
                                        <li>
                                            {msg("loginTotpInterval")}: {totp.policy.period}
                                        </li>
                                    ) : (
                                        <li>
                                            {msg("loginTotpCounter")}: {totp.policy.initialCounter}
                                        </li>
                                    )}
                                </ul>
                            </Collapsible>
                        </BoxedListItem>
                    </>
                ) : (
                    <BoxedListItem>
                        <p>{msg("loginTotpStep2")}</p>
                        <img className={styles.qr} src={`data:image/png;base64, ${totp.totpSecretQrCode}`} alt={msgStr("loginTotpTitle")} />
                        <p>
                            <a href={totp.manualUrl}>{msg("loginTotpUnableToScan")}</a>
                        </p>
                    </BoxedListItem>
                )}

                <BoxedListItem>
                    <p>{msg("loginTotpStep3")}</p>
                    <p>{msg("loginTotpStep3DeviceName")}</p>
                </BoxedListItem>
            </ol>

            <form action={url.loginAction} method="post">
                <input type="hidden" name="totpSecret" value={totp.totpSecret} />
                {mode && <input type="hidden" id="mode" value={mode} />}

                <div className={formStyles.form}>
                    <div>
                        <label htmlFor="totp">
                            {msg("authenticatorCode")} <span aria-hidden="true">*</span>
                        </label>
                        <input type="text" id="totp" name="totp" autoComplete="off" aria-invalid={messagesPerField.existsError("totp")} />
                        {totpError !== "" && (
                            <div
                                role="alert"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(totpError)
                                }}
                            />
                        )}
                    </div>

                    <div>
                        <label htmlFor="userLabel">
                            {msg("loginTotpDeviceName")} {totp.otpCredentials.length >= 1 && <span aria-hidden="true">*</span>}
                        </label>
                        <input
                            type="text"
                            id="userLabel"
                            name="userLabel"
                            autoComplete="off"
                            defaultValue={totp.otpCredentials[0]?.userLabel ?? ""}
                            aria-invalid={messagesPerField.existsError("userLabel")}
                        />
                        {userLabelError !== "" && (
                            <div
                                role="alert"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(userLabelError)
                                }}
                            />
                        )}
                    </div>

                    <div className={formStyles.optionsRow}>
                        <label htmlFor="logout-sessions">
                            <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" defaultChecked />{" "}
                            {msg("logoutOtherSessions")}
                        </label>
                    </div>

                    <div>
                        <CDIActions layout={isAppInitiatedAction ? "rowWrap" : "column"}>
                            <CDIButton type="submit">{msgStr("doSubmit")}</CDIButton>
                            {isAppInitiatedAction && (
                                <CDIButton secondary type="submit" name="cancel-aia" value="true">
                                    {msg("doCancel")}
                                </CDIButton>
                            )}
                        </CDIActions>
                    </div>
                </div>
            </form>
        </CdiTemplate>
    );
}
