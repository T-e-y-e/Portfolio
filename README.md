# Teye Etukudo — Portfolio

Personal portfolio site. It's plain static HTML, CSS and JavaScript, with no build step and no framework.

## Structure

| File | Purpose |
| --- | --- |
| `Index.html` | Page markup, SEO meta tags and the inline SVG icon sprite |
| `styles.css` | Design tokens (light and dark themes), layout and components |
| `script.js` | Theme toggle, mobile nav, scroll spy, scroll reveal, copy email and the contact form |
| `images/portrait.webp` | Hero portrait |
| `images/work/*.webp` | Project screenshots (1200px wide, WebP) |

## Running locally

Open `Index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

## Contact form

The form sends through [EmailJS](https://www.emailjs.com/). The public key, service ID and template ID are in the
`EMAILJS` object in `script.js`. The email input uses `name="to_name"` because the existing EmailJS template expects
that field name.

## Adding a project

1. Export a screenshot to WebP, for example: `cwebp -q 80 -resize 1200 0 shot.png -o images/work/name.webp`
2. Copy one of the `<li>` blocks inside `.projects` in `Index.html`, then update the link, image, meta label, title and
   description.
