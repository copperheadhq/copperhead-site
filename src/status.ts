/**
 * The public status page's data contract, and the decisions made over it.
 *
 * UptimeRobot hosts a status page for the copperhead monitors at
 * https://stats.uptimerobot.com/irTTwRgiJs and exposes its data at a public,
 * CORS-open JSON endpoint: no key, nothing private, exactly what the hosted
 * page renders. Hosting the page on their domain is free; hosting it on ours
 * is a paid feature. So /status/ reads the same JSON in the browser and draws
 * it here, which puts the page on copperhead.sh for the price of a fetch and
 * keeps it independent of the app it reports on: an outage of
 * app.copperhead.sh must not take the page that says so with it.
 *
 * Everything that decides is here, in plain TypeScript, so it can be read and
 * tested without a browser; status.astro only renders what these return.
 */

export const STATUS_PAGE_ID = 'irTTwRgiJs';
export const STATUS_PAGE_URL = `https://stats.uptimerobot.com/${STATUS_PAGE_ID}`;
export const STATUS_API_URL = `https://stats.uptimerobot.com/api/getMonitorList/${STATUS_PAGE_ID}`;

/** One monitor as the endpoint returns it (the fields this page uses). */
export type ApiMonitor = {
  monitorId: number;
  name: string;
  /** success | danger | warning | black (paused / no data) */
  statusClass: string;
  type: string;
  dailyRatios: { date: string; ratio: string; label: string; color: string }[];
  /** 90-day uptime as a string percentage, when present */
  '90dRatio'?: { ratio: string; label: string };
};

export type ApiResponse = { status: string; data: ApiMonitor[] };

export type State = 'up' | 'down' | 'degraded' | 'unknown';

export type Day = { date: string; ratio: number | null };

export type Monitor = {
  id: number;
  name: string;
  state: State;
  /** trailing 90 days, oldest first, null where nothing was measured */
  days: Day[];
  /** 90-day uptime, 0..100, or null when nothing was measured */
  uptime90: number | null;
};

export type Overall = {
  state: State;
  headline: string;
};

/** UptimeRobot's status classes, read into four states this page can name. */
export function stateOf(statusClass: string): State {
  switch (statusClass) {
    case 'success':
      return 'up';
    case 'danger':
      return 'down';
    case 'warning':
      return 'degraded';
    default:
      return 'unknown';
  }
}

/**
 * A day with ratio "0.000" and label "black" is a day nobody measured (the
 * monitor did not exist yet), not a day of total outage; the two must not
 * draw the same. Anything else is a real ratio.
 */
export function dayOf(d: ApiMonitor['dailyRatios'][number]): Day {
  if (d.label === 'black' || d.color === 'grey') return { date: d.date, ratio: null };
  const ratio = Number(d.ratio);
  return { date: d.date, ratio: Number.isFinite(ratio) ? ratio : null };
}

export function monitorOf(m: ApiMonitor): Monitor {
  const days = (m.dailyRatios ?? []).map(dayOf);
  const measured = days.filter((d): d is { date: string; ratio: number } => d.ratio !== null);
  const uptime90 =
    measured.length === 0
      ? null
      : Math.round((measured.reduce((s, d) => s + d.ratio, 0) / measured.length) * 1000) / 1000;
  return { id: m.monitorId, name: m.name, state: stateOf(m.statusClass), days, uptime90 };
}

/**
 * The line at the top. Down anywhere is down; degraded anywhere is degraded;
 * all up is operational; nothing measured is said plainly rather than shown
 * as green.
 */
export function overallOf(monitors: Monitor[]): Overall {
  if (monitors.length === 0) return { state: 'unknown', headline: 'No monitors reporting' };
  if (monitors.some((m) => m.state === 'down')) {
    const n = monitors.filter((m) => m.state === 'down').length;
    return { state: 'down', headline: n === 1 ? 'One service is down' : `${n} services are down` };
  }
  if (monitors.some((m) => m.state === 'degraded')) return { state: 'degraded', headline: 'Degraded performance' };
  if (monitors.every((m) => m.state === 'unknown')) return { state: 'unknown', headline: 'Status unknown' };
  return { state: 'up', headline: 'All systems operational' };
}

/** "99.98%" for a ratio, or a dash when nothing was measured. */
export function fmtUptime(u: number | null): string {
  if (u === null) return 'no data';
  // three decimals collapse to two unless the third matters, so 100 reads as
  // "100%" and 99.987 as "99.987%"
  const s = u.toFixed(3).replace(/\.?0+$/, '');
  return `${s}%`;
}

/** The label a day cell carries for screen readers and the title tooltip. */
export function dayLabel(d: Day): string {
  const date = new Date(`${d.date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
  return d.ratio === null ? `${date}: no data` : `${date}: ${fmtUptime(d.ratio)} uptime`;
}

/** The class a day cell draws with, from its ratio. */
export function dayClass(d: Day): 'none' | 'up' | 'partial' | 'down' {
  if (d.ratio === null) return 'none';
  if (d.ratio >= 99.9) return 'up';
  if (d.ratio >= 95) return 'partial';
  return 'down';
}
