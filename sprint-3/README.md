# Weather Station

A small, dependency-free weather widget. Search any city or use your current location to see live conditions, styled as a glowing instrument panel with an animated background that matches the sky outside.

## Features

- **Search or auto-locate** — type a city name, or tap the locate button to use your browser's geolocation. On first load, it auto-detects your location and falls back to London if location access is denied.
- **Live conditions** — temperature, feels-like, humidity, wind speed, and US Air Quality Index (AQI).
- **Tap-to-explain tiles** — tap any metric (feels like, wind, humidity, air quality) to expand a plain-language explanation, e.g. *"72% — humid, the air may feel sticky."*
- **Animated weather scene** — the background illustrates the current condition: drifting sun and clouds for clear skies, falling rain or snow, twinkling stars at night/default, drifting fog, and lightning flashes during storms. No stock photos or external image dependencies.
- **10-minute local cache** — repeat searches for the same city within 10 minutes load instantly from `localStorage` instead of re-fetching.
- **Accessible by default** — keyboard-navigable controls, visible focus states, `aria-live` regions for results and errors, and full support for `prefers-reduced-motion`.

## Files

| File         | Purpose                                              |
|--------------|-------------------------------------------------------|
| `index.html` | Page structure and markup                            |
| `style.css`  | Visual design — theming, layout, and animated scene   |
| `script.js`  | Search logic, API calls, caching, and DOM rendering   |

## How it works

The app calls two free, key-free APIs from [Open-Meteo](https://open-meteo.com/):

1. **Geocoding API** — turns a city name into latitude/longitude.
2. **Forecast API** — fetches current temperature, feels-like temperature, humidity, wind speed, and a [WMO weather code](https://open-meteo.com/en/docs#weathervariables) for that location.
3. **Air Quality API** — fetched in parallel with the forecast, returns the current US AQI.

The weather code is mapped to a condition label, an icon, and a visual theme (clear, cloudy, rain, snow, storm, fog, or default), which drives both the icon shown and the animated background.

## Running it

No build step or API key required. Just open `index.html` in a browser, or serve the folder with any static file server:

```bash
npx serve .
```

Geolocation requires a secure context (`https://` or `localhost`) — it won't work if the file is opened directly from disk in some browsers.

## Customizing

- **Default fallback city**: change `"London"` in `script.js` (in `initiateSearch` calls inside `handleGeolocation`).
- **Cache duration**: adjust `CACHE_EXPIRATION_MS` in `script.js`.
- **Colors and fonts**: edit the CSS custom properties at the top of `style.css` (`--accent`, `--font-display`, etc.) and the per-theme overrides below them.
- **Units**: the Forecast API defaults to °C and km/h. Add `&temperature_unit=fahrenheit&wind_speed_unit=mph` to the forecast request URL in `script.js` for imperial units.

## Browser support

Works in all modern evergreen browsers (Chrome, Firefox, Safari, Edge). Relies on `fetch`, `localStorage`, and the Geolocation API.