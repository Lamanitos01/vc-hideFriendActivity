# vc-hideFriendActivity

A [Vencord](https://github.com/Vendicated/Vencord) userplugin that hides the activity (game) status of chosen users **in your own client**.

Discord has no built-in way to hide *other people's* activity. This plugin adds one: right-click a user, choose **Hide activity**, and their "Playing ..." status disappears for you.

## Features

- Right-click any user (member list, friends, DMs, voice channels) → **Hide activity** / **Show activity**
- Remembers your hidden users between restarts
- Purely local: nothing is sent to Discord, no API calls, no automation
- Easy to undo: disable the plugin or toggle the user back

## Installation

Userplugins are not part of the official Vencord build, so you need to build Vencord from source once. For a general guide on installing plugins like this one, see [How to Install plugins from here](https://docs.vencord.dev/installing/custom-plugins/).

1. Install `git`, `nodejs` and `pnpm`.
2. Clone Vencord:
   ```bash
   git clone https://github.com/Vendicated/Vencord
   cd Vencord
   ```
3. Put this plugin into `src/userplugins`:
   ```bash
   mkdir -p src/userplugins
   git clone https://github.com/Lamanitos01/vc-hideFriendActivity src/userplugins/hideFriendActivity
   ```
4. Build:
   ```bash
   pnpm install
   pnpm build
   ```
5. Point your client to the build:
   - **Vesktop:** Settings → Vesktop Developer Options → Vencord Location → **Change**, then select the `Vencord/dist` folder. Fully restart Vesktop.
   - **Vencord installer:** run `pnpm inject` and follow the prompts.
6. In Vencord settings → **Plugins**, enable **HideFriendActivity**.

## Usage

Right-click a user and pick **Hide activity**. Pick **Show activity** to bring it back.

## How it works

The plugin wraps `PresenceStore.getActivities` and `PresenceStore.getPrimaryActivity` and returns an empty result for the users you hid. Your client simply never sees their activity. It does not change anything on Discord's servers or for other people.

## Troubleshooting

- **Plugin not in the list:** check that the file is at `src/userplugins/hideFriendActivity/index.tsx`, run `pnpm build` again, make sure the client uses the `dist` folder, then fully restart it.
- **Menu item missing:** update Vencord (`git pull`, `pnpm install`, `pnpm build`).
- **Status still visible somewhere:** open an issue and say where (member list, friends tab, DM, profile popout).

## Disclaimer

Modifying the Discord client is against Discord's Terms of Service. This plugin only changes what you see locally, but you use it at your own risk.

## License

GPL-3.0-or-later, the same license as Vencord. See [LICENSE](LICENSE).
