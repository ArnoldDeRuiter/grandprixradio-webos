# Grand Prix Radio (webOS)

Unofficial Grand Prix Radio player for rooted LG webOS TVs. Simple
play/pause/volume UI plus live "now playing" info. Not affiliated with
Grand Prix Radio.

Built as a standalone companion to
[f1tv-webos](https://github.com/ArnoldDeRuiter/f1tv-webos) after confirming
it's **not possible** to embed GrandPrixRadio's controls inside the F1TV
app itself — F1TV's own CSP (`frame-ancestors 'self'`) blocks all embedding,
full stop. This is a separate app you switch to instead.

## Stream

Found by inspecting the real player's network traffic on grandprixradio.nl
(not guessed): the live audio is a plain, CORS-open AAC stream via
StreamTheWorld's redirect API —

```
https://eu-player-redirect.streamtheworld.com/api/livestream-redirect/GRAND_PRIX_RADIOAAC.aac
```

302-redirects to the actual edge server, `access-control-allow-origin: *`,
works directly in a plain `<audio>` element. "Now playing" text comes from
`https://grandprixradio.nl/soundtracks/grand-prix-radio.json`, polled every
15s.

## About background playback — read before expecting this to "just work" in the background

Checked webOS TV's own App Lifecycle documentation directly: when an app
loses foreground visibility (you switch to another app, or go Home), it
receives a `visibilityChange` event and becomes **suspended** — there is no
officially documented mechanism for a community web app to keep audio
playing once that happens.

What this app *can* do, which is a different (smaller) thing: an
**"Audio-only (dim screen)"** mode — same idea as the trick in the YouTube
homebrew app's blue-button toggle — that blanks this app's own screen while
it stays the foreground app and keeps playing. That's useful for not having
a bright UI competing with whatever else is on, but it will **not** survive
actually switching to F1TV, Home, or anything else. That's a webOS platform
limit, not a bug here.

## Installing

In Homebrew Channel, open **Add repository** and enter:

```
https://raw.githubusercontent.com/ArnoldDeRuiter/grandprixradio-webos/master/repo.json
```

Grand Prix Radio then appears in the app list and updates alongside
everything else Homebrew Channel manages.

To build it yourself instead:

```sh
./build.sh
```
produces `nl.arnolderuiter.grandprixradio_<version>_all.ipk`, installable
by sideloading the ipk directly.

## License

MIT.
