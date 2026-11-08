# Lottery Companion AU — Beta v4.0

Static mobile-first PWA for GitHub Pages.

## Deploy
1. Extract this ZIP.
2. Upload **the contents** of this folder to the root of your existing `lottery-companion-au` GitHub repository, replacing the previous app files. Do not upload the ZIP itself.
3. Commit the changes to the `main` branch. GitHub Pages should redeploy automatically.
4. Open `https://codevibe-millennial.github.io/lottery-companion-au/` and refresh. If the old app remains, close it fully and reopen; the service worker cache name has changed.

## Beta features
- Game picker for TattsLotto, Oz Lotto, Powerball, Set for Life, Weekday Windfall, Super 66 and Lucky Lotteries ticket tracking.
- Manual and random picks; System entries; batch generation with overlap and consecutive-number filters.
- Device-local saved entries and CSV export.
- Latest-results area: manually add verified results or import a CSV, then compare saved entries with the latest stored result for each game.
- Historical main-number frequency analysis from a user-provided CSV.
- Installable PWA.

## Important beta limitations
- **Automatic live winning-number retrieval is not implemented.** This static site has no verified official results API integration. Open the official results page at https://www.thelott.com/results and enter/import results only after checking them. The app never invents winning numbers.
- Results and saved entries are stored in the browser on the current device. They do not sync across devices. Back up entries using CSV export before clearing browser data.
- CSV import expects columns: `game,date,numbers,powerball` and ISO dates (`YYYY-MM-DD`). Numbers should be separated by spaces, semicolons or pipes in the numbers field.
- Historical analysis expects the first numeric columns in each row to be the main winning numbers only. Clean your file first; do not include draw IDs, dates, supplementary or bonus numbers.
- Lottery game formats, draw schedules, odds and prize rules can change. Confirm current details with the official operator before relying on them. This app is independent and does not sell tickets or guarantee prizes.
- Random generation, filters, frequency statistics and System entries do not improve the probability of any individual standard combination.

## Beta testing checklist
- Test all eight game screens.
- Create/save a standard entry and a System entry.
- Generate/save/export a batch.
- Add a verified result and check saved entries.
- Export saved entries and reload after app restart.
- Test on Samsung Chrome and install to home screen.


## Automatic latest results (Beta)

The Results screen can connect to the G Network Australian Lottery API. Create a free account, enable API access, generate an API key, then paste it into **Results → Connect live results**. The key is stored only in this browser's local storage and is not included in the GitHub files. The app checks the latest available draw for Saturday Lotto, Oz Lotto, Powerball and Monday/Wednesday/Friday Weekday Windfall when opened and every 30 minutes while open. A manual Refresh results button is also available.

**Coverage limitation:** This integration currently covers Saturday Lotto/TattsLotto, Oz Lotto, Powerball and Weekday Windfall only. Set for Life, Super 66 and Lucky Lotteries remain manual until a suitable licensed data source/API is configured. Results may be published after the draw; the app shows the provider's latest available draw, not a live broadcast.

**Security and licensing:** This static GitHub Pages beta stores the API key in the browser on the device and sends it directly to the provider. Do not use this arrangement for a public/commercial service or on a shared device. The provider states its free key is for personal, non-commercial use and requires attribution. For a public or commercial release, obtain written data permission and move the key to a secure server-side proxy; never commit a key to GitHub. Check the provider's current terms before use.
