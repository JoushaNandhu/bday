# Jerslin Silviya's Cinematic Birthday Wishes Website 🎂✨

A beautiful, premium wishing website designed for Jerslin Silviya's 19th birthday. The site features elegant Christian wishes, Bible verses, an interactive candle-blowing experience with dynamic confetti, ambient music, and a funny evasive button game.

## Features Built
1. **Interactive Glassmorphic Interface**: Sleek dark theme with gold and rose-gold gradients, subtle floating elements, and a particle starfield canvas.
2. **Heavenly Blessings Slideshow**: Elegant sliding presentation of scripture verses (Jeremiah 29:11, Psalm 139:14, Psalm 20:4, and Numbers 6:24-26) with peaceful interpretations.
3. **Virtual Birthday Cake**: An SVG birthday cake with glowing candles that she can tap/click to "blow out." Blowing them triggers a sound effect, smoke rising, gold confetti explosion, and reveals a custom letter.
4. **Cheeky Evasive Button**: Two choices are presented. If she tries to hover or click the "Don't Click Me! 🚫" button, it runs away dynamically. If she somehow manages to click it, a warning modal catch pops up with a humorous message and a "rebel's verse" (Exodus 14:14).
5. **Autoplay-Safe Ambient Synthesizer**: Uses the Web Audio API to play gentle, warm wind chimes and organ chords, bypassing modern browser auto-play blocks by starting upon clicking "Enter the Celebration".

---

## How to Host on Vercel (Free & Instant)

Here are the simplest ways to host this site on Vercel:

### Method 1: Vercel Dashboard Drag & Drop (Easiest)
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard). (Create a free account if you don't have one).
2. Click **Add New** -> **Project**.
3. Scroll down and look for **"Or deploy a local directory"** or go directly to [vercel.com/deploy](https://vercel.com/deploy).
4. Zip the files (`index.html`, `styles.css`, `script.js`) and upload the folder, or simply upload this directory. Vercel will automatically host it as a high-performance static website.

### Method 2: Host via GitHub (Recommended)
1. Create a new repository on [GitHub](https://github.com/) named `jerslin-birthday`.
2. Push these files (`index.html`, `styles.css`, `script.js`) to your GitHub repository.
3. Go to [Vercel](https://vercel.com/) and click **Add New** -> **Project**.
4. Import your GitHub repository `jerslin-birthday` and click **Deploy**.
5. Every time you make updates to your GitHub repo, Vercel will automatically redeploy it!

### Method 3: Vercel CLI (For Terminal Lovers)
If you have Node.js and npm installed, you can deploy in 10 seconds via terminal:
1. Open PowerShell / Command Prompt in this folder.
2. Run:
   ```bash
   npm install -g vercel
   ```
3. Run:
   ```bash
   vercel
   ```
4. Follow the prompts (use defaults), and your site will be live!
