import { useEffect, useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import { CDIActions, CDIButton } from "../components/CDIButton";

export default function SamlPostForm(props: PageProps<Extract<KcContext, { pageId: "saml-post-form.ftl" }>, I18n>) {
    const {
        kcContext,
        i18n,
    } = props;

    const { msgStr, msg } = i18n;

    const { samlPost } = kcContext;

    const [htmlFormElement, setHtmlFormElement] = useState<HTMLFormElement | null>(null);

    useEffect(() => {
        if (htmlFormElement === null) {
            return;
        }

        // Storybook
        if (samlPost.url === "#") {
            alert("In a real Keycloak the user would be redirected immediately");
            return;
        }

        htmlFormElement.requestSubmit();
    }, [htmlFormElement]);

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("saml.post-form.title")}>
            <p>{msg("saml.post-form.message")}</p>
            <form name="saml-post-binding" method="post" action={samlPost.url} ref={setHtmlFormElement}>
                {samlPost.SAMLRequest && <input type="hidden" name="SAMLRequest" value={samlPost.SAMLRequest} />}
                {samlPost.SAMLResponse && <input type="hidden" name="SAMLResponse" value={samlPost.SAMLResponse} />}
                {samlPost.relayState && <input type="hidden" name="RelayState" value={samlPost.relayState} />}
                <CDIActions layout="rowWrap">
                    <CDIButton as="input" type="submit" value={msgStr("doContinue")} />
                </CDIActions>
                <noscript>
                    <p>{msg("saml.post-form.js-disabled")}</p>
                    <CDIActions layout="rowWrap">
                        <CDIButton as="input" type="submit" value={msgStr("doContinue")} />
                    </CDIActions>
                </noscript>
            </form>
        </CdiTemplate>
    );
}
