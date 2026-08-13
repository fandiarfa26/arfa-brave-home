# Arfabuma New Tab

A minimal, terminal-inspired New Tab page for Brave Browser. Vanilla HTML/CSS/JS,
no dependencies, works fully offline. Built on the Eldritch dark palette.

## Install

1. Open `brave://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select this project folder

The New Tab page now shows `~/home`. The extension asks for the **History**
permission (used to list your recent links).

## Files

```
├── manifest.json   MV3 manifest, overrides the New Tab page (history permission)
├── index.html      Terminal session markup
├── style.css       Eldritch palette + terminal UI
├── script.js       Clock, search, recent links, keyboard shortcuts
└── README.md
```

## Customize

All frequently changed values live at the top of `script.js`:

| Setting       | Value                 |
| ------------- | --------------------- |
| Username      | `USER`                |
| OS            | `OS`                  |
| DE/WM         | `DE_WM`               |
| Uptime        | `UPTIME`              |
| Local IP      | `LOCAL_IP`            |
| Search engine | `SEARCH_URL`          |
| ANSI colors   | `COLORS` array        |

The recent links list is pulled live from your browsing history (last 7 days,
top 8 sites) via the `history` permission.

Example:

```js
const USER = "arfabuma";
const SEARCH_URL = "https://www.google.com/search?q=";
```

After editing, reload the extension at `brave://extensions`.

## Keyboard

| Key      | Action             |
| -------- | ------------------ |
| `/`      | Focus search input |
| `Enter`  | Run search         |
| `Escape` | Clear search input |
