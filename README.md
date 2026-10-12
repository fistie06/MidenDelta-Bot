# MidenDelta Bot

A High Finance learning platform (how hedge funds make money, explained) plus trading bots that customers host
themselves on their own Hyperliquid account.
Bot 01 is a delta-neutral ETH cash and carry (spot ETH long, equal ETH-perp short, collects funding).

```
site/   Static site: home (scroll story = lesson preview), learn (learning platform: tracks + AI helper), pricing + waitlist, performance
        (simulated research), team, Impressum, Datenschutz. No build step, everything self-hosted.
bot/    (next) the bot: Hyperliquid client, cash and carry engine, licence check, safe wind-down
```

Principles that keep this a software product rather than a financial service:
- The customer installs and runs the bot, with their own Hyperliquid API wallet (trade-only, cannot withdraw).
- MidenDelta never holds funds, never sees keys and never sends trading decisions; the licence server only says
  whether a licence is valid.
- Flat subscription, no performance fee, no promised returns.

Preview the site locally:

```bash
python3 -m http.server 5176 --directory site
```
