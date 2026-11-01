# semsyilmaz.com

Personal site of Şems Yılmaz. Static Astro build, deployed to a DigitalOcean
droplet behind nginx.

## Stack

- [Astro](https://astro.build) (static output)
- Tailwind CSS
- Self-hosted fonts via `@fontsource-variable`
- Blog index pulled from the Substack RSS feed at build time

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve dist/
```

Environment:

```bash
cp .env.example .env
# PUBLIC_SUBSTACK_URL=https://semsyilmaz.substack.com/feed
```

If the feed URL is missing or unreachable, the blog page renders an empty
state instead of failing the build.

## Deploy

Builds locally and rsyncs `dist/` to the droplet, then reloads nginx:

```bash
HOST=root@<droplet-ip> ./deploy/deploy.sh
```

Defaults: key `~/.ssh/homepage_ed25519`, remote root `/var/www/semsyilmaz`.
The script installs nginx on first run, writes the site config from
`deploy/nginx.conf`, and opens the firewall when `ufw` is active.

TLS is not handled by the script. Once DNS points at the droplet, run
`certbot --nginx -d semsyilmaz.com -d www.semsyilmaz.com`.

## Structure

```
src/
  components/   Header, Footer, SEO, BlogCard
  data/site.ts  single source of truth for name, email, socials
  layouts/      BaseLayout
  lib/rss.ts    Substack feed parsing (build time)
  pages/        index, about, blog, contact, 404
deploy/         nginx config + deploy script
```

## Notes

- `site` in `astro.config.ts` drives canonical URLs and the sitemap.
- `trailingSlash: "never"` keeps canonical and sitemap URLs identical.
- OG image lives at `public/og.png` (1200×630).
