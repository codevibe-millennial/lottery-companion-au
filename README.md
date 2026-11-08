# Lottery Companion AU

A mobile-first Progressive Web App (PWA) for Australian lottery number planning.

## Included games
- TattsLotto (Saturday Lotto): 6 from 45
- Oz Lotto: 7 from 47
- Powerball: 7 from 35 plus 1 Powerball from 20
- Set for Life: 7 from 44
- Weekday Windfall: 6 from 45
- Lucky Lotteries Super Jackpot and Mega Jackpot: existing ticket tracker (raffle-style; no number prediction)
- Super 66: six digits, exact order, including leading zeroes

## Install on Android
1. Host these files on an HTTPS static web host (for example, your own web hosting).
2. Open the hosted `index.html` in Chrome on your Android phone.
3. Open Chrome menu (⋮) and choose **Install app** or **Add to Home screen**.
4. Launch Lottery Companion AU from your home screen.

For local testing on a computer, serve this folder over localhost. PWA installation/service workers generally require HTTPS or localhost; opening the HTML file directly does not enable full PWA installation.

## Important
This is an independent number planner and ticket tracker. It does not connect to The Lott, sell tickets, validate official tickets, or predict draws. Lottery odds and formats should be checked against current official rules before play. Lucky Lotteries ticket numbers are issued by the operator. The statistics page accepts user-provided CSV history and does not fabricate draw data.
