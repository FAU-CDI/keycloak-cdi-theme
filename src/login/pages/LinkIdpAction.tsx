import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import { CDIActions, CDIButton } from "../components/CDIButton";

type LinkIdpActionKcContext = Extract<KcContext, { pageId: "link-idp-action.ftl" }>;
type LinkIdpActionProps = Omit<PageProps<LinkIdpActionKcContext, I18n>, "Template">;

export default function LinkIdpAction(props: LinkIdpActionProps) {
    const { kcContext, i18n } = props;
    const { idpDisplayName, url } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <CdiTemplate
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            headerNode={msg("linkIdpActionTitle", idpDisplayName)}
            displayMessage={false}
        >
            <p>{msg("linkIdpActionMessage", idpDisplayName)}</p>

            <form action={url.loginAction} method="post">
                <CDIActions layout="rowWrap">
                    <CDIButton as="input" name="continue" type="submit" value={msgStr("doContinue")} />
                    <CDIButton as="input" secondary name="cancel-aia" type="submit" value={msgStr("doCancel")} />
                </CDIActions>
            </form>
        </CdiTemplate>
    );
}
