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

### Mobile placement

On screens up to 820px, all movements share the center of the hero viewport,
in portrait and landscape. Each text block travels gently from 26px below the
center to 26px above it as its movement progresses. Reduced motion keeps it
centered with opacity changes only. Desktop positions and all original images
remain unchanged. Centered text now intentionally passes over the photograph,
as requested.

### Included optional sound

Seven original digital piano miniatures are included in `assets/audio/` and
mapped in `story-audio.js`. They are synthesized specifically for this site,
not Edoardo's performance recordings and not excerpts of existing compositions.
See `assets/audio/README.md` for the musical concepts and provenance.

The sound control appears after the introduction and starts OFF. Only an
explicit click enables audio. A single gesture-unlocked Web Audio context
supports later scroll-driven playback, with gain ramps for mobile browsers.
No audio file is fetched or decoded before the visitor enables sound. Each
movement loads its own MP3 on demand and caches the decoded audio for return
visits during that page session.

Playback occurs once per movement entry, with a six-second replay guard against
boundary jitter. Leaving a movement fades its sound. Navigation away, hiding
the tab, and page exit stop playback and reset sound to OFF. Failed playback
also resets the toggle. Deferred loads cannot play after the visitor has moved
on or muted. The existing SoundCloud embeds in Recordings are unchanged.

To replace a miniature with Edoardo's recording, replace the corresponding
MP3 or update its relative path in `story-audio.js`. The optional renderer at
`tools/render-piano.py` regenerates the supplied scores using NumPy, SciPy and
FFmpeg; these tools are not needed to host or run the site.

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
clipping, and clean end-of-sequence release. The included digital piano clips also need a final listening check on the
target phone/browser; automated checks verify decoding, duration and levels. No public deployment was performed.
