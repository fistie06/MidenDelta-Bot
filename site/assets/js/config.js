// Site-wide settings. Edit these before going live.
export const CONFIG = {
  // POST endpoint for the waitlist form (Formspree). Receives JSON: { form: "bot-waitlist", ...fields }.
  // Leave empty to fall back to a pre-filled email to `contactEmail`.
  formEndpoint: "https://formspree.io/f/meaozrvw",

  // Fallback inbox when no endpoint is set.
  contactEmail: "max@midendelta.com",

  // Learning platform channels. Leave empty to hide the links; fill in once the channels are public.
  youtubeUrl: "",
  xUrl: "",

  // Public strategy research: a simulated backtest of a generic ETH cash and carry.
  performanceUrl: "performance.html",
};
