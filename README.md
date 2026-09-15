# Edoardo Amendola — Website

Static, responsive website for **edoardoamendola.com**. No build system and no backend are required.

## Files

- `index.html` — page structure
- `style.css` — visual design / responsive layout
- `script.js` — navigation + EN/IT/TR language switching
- `assets/hero.png` — homepage hero image
- `assets/collage.png` — collage used behind inner sections
- `CNAME` — custom domain for GitHub Pages

## Publish on GitHub Pages

1. Create a new GitHub repository, for example `edoardoamendola.com`.
2. Upload all files from this folder to the **root** of the repository.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**, then Save.
6. In **Custom domain**, enter `edoardoamendola.com`.
7. Configure the DNS records at the company where you bought the domain. GitHub will show the exact records/check status in Pages settings.
8. After DNS is verified, enable **Enforce HTTPS**.

The included `CNAME` file already contains `edoardoamendola.com`.

## Edit content

All text lives in the `copy` object inside `script.js`, with separate `en`, `it`, and `tr` sections. The About/Concerts/Lessons text has already been filled in from Edoardo's CV; edit it there any time.

The contact email is currently `edoamendola@hotmail.it` (from the CV). To use a different address (for example an `@edoardoamendola.com` inbox once you set one up), search for `edoamendola@hotmail.it` in `script.js` and replace both occurrences (link + display text) in each language block.

To add real audio later, replace the placeholder inside the `recordings` section with an HTML `<audio controls>` element or an embed from Spotify / SoundCloud / YouTube.

## Notes on the images

The existing `<picture>` uses `hero-desktop.png` above 820px and
`hero-mobile.png` on narrower screens. Both use the existing `object-fit: contain`
and `object-position: center top`. These images include the signature and quote.
All supplied image files are unchanged.

## Scroll storytelling

The homepage uses its existing hero as a native sticky stage, with a total height
of 600svh on desktop and 500svh on mobile. There is no extra hero image or new
framework. The seven movements use the supplied 12–100% timeline; the beginning
and end are clear. Navigation still opens the existing content panels.

`script.js` contains `STORY_MOVEMENTS`, the existing `copy` translations, and
shared animation/audio functions. Resize events cache the scroll geometry.
Scroll frames update opacity and transforms, with small letter-spacing changes
for Rubato and Resonance. Inactive movements are hidden visually and from the
accessibility tree. Reduced motion removes movement and retains the text sequence.

### Optional sound

No local piano recordings were supplied. The sound control stays hidden until
at least one recording is configured; it never indicates that missing audio is
playing. Existing SoundCloud embeds in Recordings are unchanged.

1. Put actual recordings in `assets/audio/`.
2. In `story-audio.js`, replace the relevant `null` values with the commented
   relative paths. Leave `silence` null. Da Capo can reuse `listening.mp3`.
3. Reload the page. The localized, keyboard-accessible sound toggle appears
   after the introduction and starts OFF. Only clicking it enables playback.

Playback occurs once per movement entry, with a six-second replay guard against
boundary jitter. Moving out of a movement fades its sound. Navigation away,
hiding the tab, and page exit stop playback and reset sound to OFF. Failed
playback also resets the toggle. There are no generated or external audio files.

### Verification

From this directory, run with Node.js:

```sh
node --check script.js
node tests/controller.cjs
node tests/regression.cjs
```

The controller tests execute the actual script with lightweight DOM and audio
adapters. They cover 1,001 scroll positions, reverse-scroll determinism, EN/IT/TR,
reduced-motion behavior, all five content panels, and audio opt-in, threshold
jitter, navigation and visibility cleanup. They are logic tests, not a rendering
engine or an audio listening test. The regression test verifies restrained
Resonance spacing and the longer-lasting second sentence.

Browser visual QA remains necessary: the available preview browser could not
access the local server. Before publishing, compare the starting viewport with
the original, and check all seven movements at desktop, tablet, portrait phone,
and landscape phone sizes. Check text against face, hands, signature, sheet music
and keyboard, then repeat in Italian and Turkish. Test actual Safari/iOS toolbar
resizing, menu/language clicks, reverse scroll, reduced motion, horizontal
clipping, and clean end-of-sequence release. Real audio needs a listening test
once recordings are supplied. No public deployment was performed.
