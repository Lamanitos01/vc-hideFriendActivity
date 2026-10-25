/*
 * HideFriendActivity, a Vencord userplugin
 * Copyright (c) 2026 lamanitos
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { findStoreLazy } from "@webpack";
import { Menu } from "@webpack/common";

const PresenceStore = findStoreLazy("PresenceStore");

const settings = definePluginSettings({
    hiddenUsers: {
        type: OptionType.CUSTOM,
        default: [] as string[],
    },
});

function isHidden(userId: string): boolean {
    return settings.store.hiddenUsers.includes(String(userId));
}

function refreshUI() {
    try { PresenceStore.emitChange?.(); } catch {  }
}

function toggleUser(userId: string) {
    const id = String(userId);
    const list: string[] = settings.store.hiddenUsers;
    settings.store.hiddenUsers = list.includes(id)
        ? list.filter(x => x !== id)
        : [...list, id];
    refreshUI();
}

const userContextMenuPatch: NavContextMenuPatchCallback = (children, props: { user?: { id: string; }; }) => {
    const user = props?.user;
    if (!user) return;

    const hidden = isHidden(user.id);

    children.push(
        <Menu.MenuSeparator />,
        <Menu.MenuItem
            id="vc-hide-friend-activity"
            label={hidden ? "Show activity" : "Hide activity"}
            action={() => toggleUser(user.id)}
        />
    );
};

let origGetActivities: any;
let origGetPrimaryActivity: any;

export default definePlugin({
    name: "HideFriendActivity",
    description: "Hide the activity (game) status of chosen users in your own client. Right-click a user to toggle.",
    authors: [{ name: "lamanitos", id: 721453359575466106n }],
    settings,

    contextMenus: {
        "user-context": userContextMenuPatch,
    },

    start() {
        origGetActivities = PresenceStore.getActivities;
        origGetPrimaryActivity = PresenceStore.getPrimaryActivity;

        PresenceStore.getActivities = function (userId: string, ...rest: any[]) {
            if (isHidden(userId)) return [];
            return origGetActivities.call(this, userId, ...rest);
        };

        PresenceStore.getPrimaryActivity = function (userId: string, ...rest: any[]) {
            if (isHidden(userId)) return null;
            return origGetPrimaryActivity.call(this, userId, ...rest);
        };

        refreshUI();
    },

    stop() {
        if (origGetActivities) PresenceStore.getActivities = origGetActivities;
        if (origGetPrimaryActivity) PresenceStore.getPrimaryActivity = origGetPrimaryActivity;
        refreshUI();
    },
});
