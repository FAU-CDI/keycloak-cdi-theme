import { useId, useLayoutEffect, useRef, useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import CdiUserProfileForm from "../components/CdiUserProfileForm";
import MessageAlert from "../components/MessageAlert";

type RegisterKcContext = Extract<KcContext, { pageId: "register.ftl" }>;
type RegisterProps = Omit<PageProps<RegisterKcContext, I18n>, "Template">;

export default function Register(props: RegisterProps) {
    const { kcContext, i18n } = props;

    const { messageHeader, url, messagesPerField, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction, termsAcceptanceRequired } =
        kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const [areTermsAccepted, setAreTermsAccepted] = useState(false);
    const registerFormRef = useRef<HTMLFormElement>(null);

    useLayoutEffect(() => {
        const w = window as unknown as { onSubmitRecaptcha?: () => void };
        w.onSubmitRecaptcha = () => {
            registerFormRef.current?.requestSubmit();
        };

        return () => {
            delete w.onSubmitRecaptcha;
        };
    }, []);

    const message = ("message" in kcContext ? kcContext.message : undefined) as
        | { type: "success" | "warning" | "error" | "info"; summary: string }
        | undefined;
    const isAppInitiatedAction = ("isAppInitiatedAction" in kcContext ? kcContext.isAppInitiatedAction : undefined) as boolean | undefined;
    const showMessage = message !== undefined && (message.type !== "warning" || !isAppInitiatedAction);
    const messageNode = showMessage && message ? <MessageAlert type={message.type} summary={message.summary} /> : null;

    return (
        <CdiTemplate
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            displayMessage={true}
            headerNode={messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")}
        >
            {messageNode}
            <CdiUserProfileForm
                formRef={registerFormRef}
                action={url.registrationAction}
                i18n={i18n}
                doMakeUserConfirmPassword={true}
                kcContext={kcContext}
                submitLabel={msgStr("doRegister")}
                isSubmitDisabled={termsAcceptanceRequired && !areTermsAccepted}
                extraNode={
                    <>
                        {termsAcceptanceRequired && (
                            <TermsAcceptance
                                i18n={i18n}
                                messagesPerField={messagesPerField}
                                areTermsAccepted={areTermsAccepted}
                                onAreTermsAcceptedValueChange={setAreTermsAccepted}
                            />
                        )}
                        {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                            <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction} />
                        )}
                    </>
                }
                footerNode={
                    <div>
                        <a href={url.loginUrl} data-second-button role="button">
                            {msg("backToLogin")}
                        </a>
                    </div>
                }
                renderPrimaryButton={
                    recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined
                        ? ({ disabled, label }) => (
                              <button
                                  className="g-recaptcha"
                                  data-sitekey={recaptchaSiteKey}
                                  data-callback="onSubmitRecaptcha"
                                  data-action={recaptchaAction}
                                  type="submit"
                                  disabled={disabled}
                                  data-action-button
                              >
                                  {label}
                              </button>
                          )
                        : undefined
                }
            />
        </CdiTemplate>
    );
}

function TermsAcceptance(props: {
    i18n: I18n;
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}) {
    const { i18n, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props;

    const { msg } = i18n;
    const termsCheckboxId = useId();
    const termsErrorId = useId();

    return (
        <>
            <div>
                <div>{msg("termsTitle")}</div>
                <div>{msg("termsText")}</div>
            </div>
            <div>
                <label htmlFor={termsCheckboxId}>
                    <input
                        type="checkbox"
                        id={termsCheckboxId}
                        name="termsAccepted"
                        checked={areTermsAccepted}
                        onChange={e => onAreTermsAcceptedValueChange(e.target.checked)}
                        aria-invalid={messagesPerField.existsError("termsAccepted")}
                        aria-describedby={messagesPerField.existsError("termsAccepted") ? termsErrorId : undefined}
                    />{" "}
                    {msg("acceptTerms")}
                </label>
                {messagesPerField.existsError("termsAccepted") && (
                    <div
                        id={termsErrorId}
                        role="alert"
                        dangerouslySetInnerHTML={{
                            __html: kcSanitize(messagesPerField.get("termsAccepted"))
                        }}
                    />
                )}
            </div>
        </>
    );
}
