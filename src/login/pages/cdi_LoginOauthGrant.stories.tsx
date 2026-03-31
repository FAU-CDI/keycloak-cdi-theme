import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";
import { localeDE, localeEN, realm } from "./cdi_stories_shared";

const { KcPageStory } = createKcPageStory({ pageId: "login-oauth-grant.ftl" });

const meta = {
    title: "cdi/login-oauth-grant",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultEnglish: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeEN,
                url: { oauthAction: "/oauth-action" },
                oauth: {
                    clientScopesRequested: [{ consentScreenText: "Profile", dynamicScopeParameter: "Email" }, { consentScreenText: "Organization" }],
                    code: "mockCode"
                },
                client: {
                    attributes: {
                        logoUri: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Commons-logo.svg",
                        policyUri: "https://example.org/privacy",
                        tosUri: "https://example.org/terms"
                    },
                    name: "Fancy ELN",
                    clientId: "fancy-eln"
                }
            }}
        />
    )
};

export const DefaultGerman: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeDE,
                url: { oauthAction: "/oauth-action" },
                oauth: {
                    clientScopesRequested: [{ consentScreenText: "Profil", dynamicScopeParameter: "Email" }, { consentScreenText: "Organisation" }],
                    code: "mockCode"
                },
                client: {
                    attributes: {
                        logoUri: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Commons-logo.svg",
                        policyUri: "https://example.org/privacy",
                        tosUri: "https://example.org/terms"
                    },
                    name: "Fancy ELN",
                    clientId: "fancy-eln"
                }
            }}
        />
    )
};
