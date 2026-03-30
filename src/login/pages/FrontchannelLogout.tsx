import { useEffect, useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import BoxedListItem from "../components/BoxedListItem";
import { CDIButton } from "../components/CDIButton";

type FrontchannelLogoutKcContext = Extract<KcContext, { pageId: "frontchannel-logout.ftl" }>;
type FrontchannelLogoutProps = Omit<PageProps<FrontchannelLogoutKcContext, I18n>, "Template">;

export default function FrontchannelLogout(props: FrontchannelLogoutProps) {
    const { kcContext, i18n } = props;

    const { logout } = kcContext;

    const { msg, msgStr } = i18n;

    const [iframeLoadCount, setIframeLoadCount] = useState(0);

    useEffect(() => {
        if (!logout.logoutRedirectUri) {
            return;
        }

        if (iframeLoadCount !== logout.clients.length) {
            return;
        }

        window.location.replace(logout.logoutRedirectUri);
    }, [iframeLoadCount, logout.clients.length, logout.logoutRedirectUri]);

    return (
        <CdiTemplate
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            displayMessage={false}
            documentTitle={msgStr("frontchannel-logout.title")}
            headerNode={msg("frontchannel-logout.title")}
        >
            <p>{msg("frontchannel-logout.message")}</p>

            {logout.clients.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem" }}>
                    {logout.clients.map(client => (
                        <BoxedListItem key={client.name}>
                            <div style={{ fontWeight: 600 }}>{client.name}</div>
                            <iframe
                                src={client.frontChannelLogoutUrl}
                                style={{ display: "none" }}
                                onLoad={() => {
                                    setIframeLoadCount(count => count + 1);
                                }}
                                title={client.name}
                            />
                        </BoxedListItem>
                    ))}
                </ul>
            )}

            {logout.logoutRedirectUri !== undefined && (
                <CDIButton as="a" href={logout.logoutRedirectUri}>
                    {msg("doContinue")}
                </CDIButton>
            )}
        </CdiTemplate>
    );
}
