# Brave Custom Home

Build a custom New Tab page for Brave Browser as a lightweight Chromium extension.

## Goal

Create a minimalist personal home page that feels like a terminal CLI rather than a traditional web dashboard.

The page should feel like:

* A terminal
* A developer workspace
* Minimal and distraction-free
* Fast and lightweight
* Keyboard-friendly
* Functional rather than decorative

Do not make it look like a typical SaaS dashboard, portfolio, or modern landing page.

## Visual Direction

Use a dark terminal-inspired interface.

The primary visual reference is a Linux terminal running a CLI application.

Characteristics:

* Dark background
* Monospace typography
* Minimal borders
* Minimal rounded corners
* Sparse layout
* Subtle visual hierarchy
* No unnecessary cards
* No gradients
* No glassmorphism
* No excessive shadows
* No large illustrations
* No unnecessary animations

The design should feel closer to a terminal UI than a web application.

## Color Theme

Use the **Eldritch** color palette as the primary visual inspiration.

Use Eldritch colors consistently for:

* Background
* Primary text
* Muted text
* Accent text
* Links
* Focus states
* Borders
* Interactive elements

Do not use arbitrary colors outside the Eldritch-inspired palette unless necessary for accessibility.

The overall appearance should remain dark and low-contrast, with accent colors used sparingly.

## Typography

Use a monospace font.

Prefer fonts commonly available on Linux systems, such as:

* JetBrains Mono
* Fira Code
* Iosevka
* system monospace fallback

Use font stacks rather than requiring a web font download.

Typography should resemble a terminal:

```text
$ command
output
```

Avoid oversized marketing-style typography.

## Layout

Keep the entire interface compact and centered.

Suggested structure:

```text
~/home

┌──────────────────────────────────────────────┐
│ $ whoami                                     │
│ fandi                                        │
│                                              │
│ $ date                                       │
│ Thursday, August 13, 2026                   │
│                                              │
│ $ time                                       │
│ 14:10                                        │
│                                              │
│ $ search                                     │
│ > _                                          │
│                                              │
│ $ ls ~/links                                 │
│ github   youtube   linkedin   gmail          │
│                                              │
│ $ _                                          │
└──────────────────────────────────────────────┘
```

This is only a visual direction.

Do not blindly reproduce this exact layout if a better terminal-inspired composition can be created.

## Main Features

### 1. Greeting

Display a simple terminal-like greeting.

Example:

```text
$ whoami
fandi
```

Keep it subtle.

### 2. Date and Time

Display the current date and time.

Example:

```text
$ date
Thursday, August 13, 2026

$ time
14:10
```

The clock should update automatically.

Use the user's local browser timezone.

Do not fetch the time from an external API.

### 3. Search

Provide a primary search input.

The search interface should look like a terminal command prompt.

Example:

```text
$ search
> _
```

Pressing Enter should perform a web search.

Use a configurable search engine.

Default:

```text
https://www.google.com/search?q=
```

Keep the search implementation simple.

### 4. Quick Links

Provide a small collection of developer-oriented links.

Example:

```text
$ ls ~/links

github
youtube
linkedin
gmail
```

Links should be visually minimal.

Avoid large buttons or cards.

Use simple text links.

### 5. Keyboard Interaction

The page should be keyboard-friendly.

Requirements:

* Search input should be easy to focus.
* Pressing `/` should focus the search input.
* Pressing `Escape` should clear the search input.
* Pressing Enter should execute the search.
* Links should remain accessible through normal keyboard navigation.

Avoid implementing complicated keyboard shortcuts unless they provide real value.

### 6. Command Prompt Feel

Use CLI-inspired labels such as:

```text
$
>
~/links
~/projects
```

However, do not overuse terminal symbols.

The interface should feel inspired by CLI design, not like a fake terminal emulator.

## Functional Requirements

The page must work completely offline except when the user intentionally performs a search or opens a link.

Do not introduce unnecessary API calls.

Do not add analytics.

Do not add tracking.

Do not add external dependencies unless they provide significant value.

The New Tab page should load almost instantly.

## Technical Requirements

Use:

* HTML
* CSS
* Vanilla JavaScript

Do not use React, Vue, Svelte, Next.js, or other frameworks.

Do not introduce a build system unless absolutely necessary.

The project should remain easy to modify manually.

Expected structure:

```text
brave-newtab/
├── manifest.json
├── index.html
├── style.css
├── script.js
└── README.md
```

Use Chrome Extension Manifest V3.

`manifest.json` should override the New Tab page:

```json
{
  "manifest_version": 3,
  "name": "Fandi New Tab",
  "version": "1.0.0",
  "description": "Minimal terminal-inspired Brave New Tab",
  "chrome_url_overrides": {
    "newtab": "index.html"
  }
}
```

## Responsive Design

The page must work well on:

* Laptop screens
* Desktop screens
* Smaller browser windows

Do not create a mobile-first application.

Prioritize desktop browser usage.

Avoid unnecessary responsive complexity.

## Interaction Design

Keep interactions subtle.

Allowed:

* Cursor blinking
* Small hover state
* Focus indicator
* Very subtle transition

Avoid:

* Parallax
* Floating animations
* Animated gradients
* Particle effects
* Large transitions
* Excessive motion

The user should feel like they opened a terminal, not a Dribbble portfolio from 2017.

## Accessibility

Ensure:

* Sufficient text contrast
* Visible keyboard focus
* Semantic HTML
* Proper labels for inputs
* Links are keyboard accessible
* Reduced-motion preference is respected

Support:

```css
@media (prefers-reduced-motion: reduce)
```

## Configuration

Keep frequently changed values easy to modify.

For example, links should be defined in one obvious place in `script.js`.

Example:

```js
const links = [
  {
    name: "github",
    url: "https://github.com/"
  },
  {
    name: "youtube",
    url: "https://youtube.com/"
  }
];
```

Do not scatter configuration across multiple files unnecessarily.

## Performance

Performance is important.

Avoid:

* Large images
* External fonts
* Heavy JavaScript
* Large libraries
* API polling
* Unnecessary DOM updates

The New Tab should be lightweight enough to run comfortably on a mid-range laptop.

## Code Quality

Write clean, readable code.

Prefer simple solutions over abstractions.

Do not over-engineer the application.

Use semantic HTML.

Keep JavaScript modular enough to understand, but do not create unnecessary architecture for a tiny application.

Add comments only where they explain non-obvious decisions.

## Development Workflow

Before implementing:

1. Inspect the existing project structure.
2. Identify the current implementation.
3. Preserve useful existing code if present.
4. Implement the design incrementally.
5. Test the extension in Brave.
6. Verify the New Tab override works.
7. Verify keyboard navigation.
8. Verify search.
9. Verify date and time.
10. Verify the layout at different window sizes.

## Final Quality Criteria

The final result should satisfy these principles:

1. It looks like a terminal-inspired homepage.
2. It uses an Eldritch-inspired dark palette.
3. It is minimalist.
4. It feels like a developer tool.
5. It loads quickly.
6. It has no unnecessary visual decoration.
7. It works entirely as a local Brave extension.
8. It is easy to customize.
9. It is keyboard-friendly.
10. It does not feel like a generic AI-generated dashboard.

Prioritize **simplicity, usability, and terminal aesthetics** over feature count.
