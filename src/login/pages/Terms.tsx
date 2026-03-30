import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import { CDIActions, CDIButton } from "../components/CDIButton";

type TermsKcContext = Extract<KcContext, { pageId: "terms.ftl" }>;
type TermsProps = Omit<PageProps<TermsKcContext, I18n>, "Template">;

export default function Terms(props: TermsProps) {
    const { kcContext, i18n } = props;

    const { msg, msgStr } = i18n;

    const { url } = kcContext;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} displayMessage={false} headerNode={msg("termsTitle")}>
            <div
                dangerouslySetInnerHTML={{
                    __html: kcSanitize(msgStr("termsText"))
                }}
            />

            <form action={url.loginAction} method="post">
                <CDIActions>
                    <CDIButton name="accept" type="submit">
                        {msgStr("doAccept")}
                    </CDIButton>
                    <CDIButton secondary name="cancel" type="submit">
                        {msgStr("doDecline")}
                    </CDIButton>
                </CDIActions>
            </form>
        </CdiTemplate>
    );
}
