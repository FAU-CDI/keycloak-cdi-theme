import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";
import { localeDE, localeEN, realm } from "./cdi_stories_shared";

const { KcPageStory } = createKcPageStory({ pageId: "login-page-expired.ftl" });

const meta = {
    title: "cdi/login-page-expired.ftl",
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
                url: {
                    loginRestartFlowUrl: "/mock-restart-flow",
                    loginAction: "/mock-continue-login"
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
                url: {
                    loginRestartFlowUrl: "/mock-restart-flow",
                    loginAction: "/mock-continue-login"
                }
            }}
        />
    )
};

