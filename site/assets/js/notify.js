// Launch notification for the High Finance learning platform. Opens by itself once when a visitor enters the site
// (arrival from another site, a link or an app like Instagram), not on every page change, and without
// storing anything on the device: "entry" is read from the referrer. Any [data-notify] button opens it too.
import { CONFIG } from "./config.js";

const AUTO_PAGES = ["home", "pricing", "learn", "team"];
const DELAY_MS = 2600; // after the intro coin has landed

function html() {
  return `
  <div class="notify" id="notify" role="dialog" aria-modal="true" aria-labelledby="notify-title" hidden>
    <div class="notify-box">
      <button type="button" class="notify-close" aria-label="Close">×</button>
      <div class="ask">
        <span class="deal">Free</span>
        <h2 id="notify-title">High Finance, explained. Launching soon.</h2>
        <p>We break down how hedge funds actually make money, with real data and no fluff. Leave your email and we'll tell you the day it goes live.</p>
        <form novalidate>
          <input type="email" name="email" autocomplete="email" inputmode="email" placeholder="you@email.com" aria-label="Email address" required />
          <button class="btn btn-primary" type="submit">Notify me at launch</button>
          <p class="err" role="alert"></p>
          <p class="fine">Launch and course emails only, unsubscribe anytime. See the <a href="datenschutz.html">privacy policy</a>.</p>
        </form>
      </div>
      <div class="done" hidden tabindex="-1">
        <span class="deal">✓</span>
        <h2 style="margin-top:16px">You're on the list.</h2>
        <p>We'll email you the day the platform launches. Until then, scroll through the first lesson: how a cash and carry works.</p>
        <div class="second-ask">
          <h3>One more thing</h3>
          <p>We're considering publishing this strategy as a ready-to-deploy bot you run on your own account. Separate list, separate email — only if you want it.</p>
          <button type="button" class="btn btn-ghost btn-sm" data-bot-interest>Yes, keep me posted about the bot</button>
          <p class="err bot-err" role="alert"></p>
        </div>
      </div>
    </div>
  </div>`;
}

async function send(email, kind) {
  if (!CONFIG.formEndpoint) throw new Error("no form endpoint");
  const of = kind === "bot"
    ? { form: "bot-interest", _subject: `Bot interest: ${email}`, interest: "Ready-to-deploy bot" }
    : { form: "platform-launch", _subject: `Platform launch notify: ${email}`, interest: "High Finance learning platform" };
  const res = await fetch(CONFIG.formEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...of, email }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export function initNotify(page) {
  document.body.insertAdjacentHTML("beforeend", html());
  const el = document.getElementById("notify");
  const form = el.querySelector("form");
  const input = form.querySelector("input");
  const err = form.querySelector(".err");
  let prevFocus = null;

  // The story canvas keeps rendering behind this dialog otherwise. home.js
  // listens and stops the scene while it is open.
  const announce = (open) => dispatchEvent(new CustomEvent("notify:toggle", { detail: { open } }));

  const open = () => {
    if (!el.hidden) return;
    prevFocus = document.activeElement;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add("open"));
    announce(true);
    // no auto-focus on touch screens: the keyboard would cover the offer
    if (!matchMedia("(pointer: coarse)").matches) input.focus({ preventScroll: true });
  };
  const close = () => {
    el.classList.remove("open");
    announce(false);
    setTimeout(() => (el.hidden = true), 300);
    prevFocus?.focus?.({ preventScroll: true });
  };

  el.querySelector(".notify-close").addEventListener("click", close);
  el.addEventListener("click", (e) => { if (e.target === el) close(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !el.hidden) close(); });
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-notify]")) { e.preventDefault(); open(); }
  });

  let signedUpAs = "";

  // Interest in the bot is recorded as its own submission under its own form
  // name, so the two lists stay separate — the platform list is the one people
  // actually opted into.
  el.querySelector("[data-bot-interest]").addEventListener("click", async (e) => {
    const b = e.currentTarget;
    const be = el.querySelector(".bot-err");
    b.disabled = true; b.textContent = "Sending…"; be.textContent = "";
    try {
      await send(signedUpAs, "bot");
      b.textContent = "Noted — we'll be in touch.";
    } catch (x) {
      console.error(x);
      b.disabled = false; b.textContent = "Yes, keep me posted about the bot";
      be.textContent = "That didn't go through. Please try again in a moment.";
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!input.checkValidity()) { err.textContent = "Enter a valid email address."; input.focus(); return; }
    const btn = form.querySelector("button");
    btn.disabled = true; btn.textContent = "Sending…"; err.textContent = "";
    try {
      const addr = input.value.trim();
      await send(addr, "platform");
      signedUpAs = addr;
      el.querySelector(".ask").hidden = true;
      const done = el.querySelector(".done");
      done.hidden = false; done.focus({ preventScroll: true });
    } catch (x) {
      console.error(x);
      btn.disabled = false; btn.textContent = "Notify me at launch";
      err.textContent = "That didn't go through. Please try again in a moment.";
    }
  });

  let entry = true;
  try { entry = !document.referrer || new URL(document.referrer).origin !== location.origin; } catch { /* keep true */ }
  if (entry && AUTO_PAGES.includes(page)) setTimeout(open, DELAY_MS);
}
