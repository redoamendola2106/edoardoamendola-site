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

`hero.png` and `collage.png` are used as full design artwork (they already contain the large title/quote typography). The site displays `hero.png` in full (no cropping) on desktop, and crops in to frame Edoardo on narrow/mobile screens. If you ever swap in a new hero photo, keep it free of any baked-in navigation/menu text — the live header above it already provides the nav, in all 3 languages.
