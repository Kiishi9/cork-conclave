# The Cork Conclave Website

This is a simple, elegant marketing website built with Next.js. It is designed to be easy to update, even if you are not a developer.

## What you need before you start

1. Install **Node.js** (this includes npm).
   - Download: https://nodejs.org/en/download/
2. Open a terminal/command prompt in this project folder.

## Install the dependencies

Run this once:

```bash
npm install
```

This downloads everything the site needs to run.

## Run the site locally

Start the site on your computer:

```bash
npm run dev
```

Then open:
http://localhost:3000

The site will refresh automatically when you save changes.

## Where the pages live (and how to edit them)

All pages are in `src/app/`:

- Home page: `src/app/page.tsx`
- About page: `src/app/about/page.tsx`
- Events page: `src/app/events/page.tsx`
- Gallery page: `src/app/gallery/page.tsx`
- Contact page: `src/app/contact/page.tsx`

Open the file you want, change the text, and save. The site updates right away.

## Common edits (copy + paste friendly)

### Update the Instagram link
Edit this file:
- `src/lib/site.ts`

Change this line:
```ts
instagram: "https://www.instagram.com/thecorkconclave/"
```

### Update the contact email or location
Edit this file:
- `src/lib/site.ts`

Update these lines:
```ts
email: "hello@thecorkconclave.com"
city: "Ibadan"
country: "Nigeria"
```

### Update the events list
Edit this file:
- `src/app/events/page.tsx`

Look for the `events` list at the top of the file and change the titles or descriptions.

### Update hero text on the homepage
Edit this file:
- `src/app/page.tsx`

Look for the large heading and paragraph inside the `<section className="hero">`.

## Styling and design

Global styles are in:
- `src/app/globals.css`

This controls colors, spacing, fonts, and buttons for the whole site.

## If something doesn’t work

- Make sure you ran `npm install` first.
- Stop the dev server with `Ctrl + C` and run `npm run dev` again.
- If errors persist, delete the `node_modules` folder and run `npm install` again.

## Deploy on Vercel

Vercel is the easiest way to publish a Next.js site.

1. Create an account at https://vercel.com
2. Click **Add New → Project**
3. Import this GitHub repository
4. Keep the default settings and click **Deploy**

After it finishes, Vercel gives you a live URL. Any future GitHub updates will redeploy automatically.

## Learn More (optional)

- Next.js docs: https://nextjs.org/docs
