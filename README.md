# Abhi Playlist

A clean, fresh GitHub Pages repository for **Abhi Playlist**.

## Included

- Mobile-first custom music UI
- Random background on refresh
- Tap ripple effect
- Swipe up/down playlist navigation
- Start Listening gate for browser autoplay restrictions
- Official YouTube IFrame Player API for standard playlists
- Play / pause / next / previous / shuffle / repeat
- 7 playlists supplied for this project
- 5 supplied background images
- `.nojekyll` for GitHub Pages

## Playlist note

The two Bhojpuri links beginning with `RDCLAK5uy_` are YouTube Mix/auto-generated links, not normal `PL...` playlist IDs. They therefore use the **Open on YouTube** action instead of pretending to be standard embeddable playlists.

The other supplied `PL...` playlist IDs are configured for the official YouTube IFrame Player API. Some individual YouTube videos can still refuse embedding; the UI reports that case.

## GitHub Pages

1. Create a brand-new empty GitHub repository.
2. Upload the contents of this ZIP to the repository root.
3. Make sure `index.html`, `style.css`, `script.js`, `.nojekyll`, and the `images` folder are directly in the root.
4. Go to **Settings → Pages**.
5. Select **Deploy from a branch**.
6. Select **main** and **/(root)**.
7. Save and wait for GitHub Pages to publish.

## Add more images

Put additional images inside `images/`. To use them as selectable/random backgrounds, add their filenames to the image list in `script.js`.
