import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import { CDIActions, CDIButton } from "../components/CDIButton";

type DeleteCredentialKcContext = Extract<KcContext, { pageId: "delete-credential.ftl" }>;

export default function DeleteCredential(props: PageProps<DeleteCredentialKcContext, I18n>) {
    const { kcContext, i18n } = props;

    const { msgStr, msg } = i18n;

    const { url, credentialLabel } = kcContext;

    return (
        <CdiTemplate
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            displayMessage={false}
            headerNode={msg("deleteCredentialTitle", credentialLabel)}
        >
            <p>{msg("deleteCredentialMessage", credentialLabel)}</p>

            <form action={url.loginAction} method="post">
                <CDIActions>
                    <CDIButton name="accept" type="submit">
                        {msgStr("doConfirmDelete")}
                    </CDIButton>
                    <CDIButton secondary name="cancel-aia" type="submit">
                        {msgStr("doCancel")}
                    </CDIButton>
                </CDIActions>
            </form>
        </CdiTemplate>
    );
}
