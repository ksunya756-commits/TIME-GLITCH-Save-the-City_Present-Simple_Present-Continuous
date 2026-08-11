# TIME GLITCH — MASTER CODEX SPECIFICATION
## Complete implementation brief for the educational browser game

> **STATUS: CANONICAL PROJECT SPEC**
>
> This file is the single source of truth for Codex.
> If older notes, generated asset sheets, mockups, or experimental instructions conflict with this file, **follow this file**.
>
> Do not redesign the project, add new levels, add enemies, replace the heroine, or invent new mechanics unless explicitly requested.

---

# 0. Codex: read this first

Build a complete, polished, responsive browser game called **TIME GLITCH** for practising the difference between:

- **Present Simple**
- **Present Continuous**
- their **signal words**

The target is a roughly **35–40 minute lesson/game session**, including normal thinking time and short pauses.

The game must work:

- on desktop;
- on laptop;
- on mobile;
- after publishing to **GitHub Pages**;
- with **1–7 players**;
- with mouse, touch, and keyboard-accessible controls;
- without a backend;
- without external APIs;
- without background music.

Use the user's existing assets from the local `images/` folder.

**Do not generate new images.**
**Do not fetch random online assets.**
**Do not replace approved assets with placeholders when an asset exists.**

If an expected asset is missing, use a restrained CSS placeholder for development, log the missing logical asset name, and keep the game functional. Do not invent a new visual identity.

---

# 1. Core concept

A glitch has mixed up two kinds of time signals:

- **ROUTINE** → Present Simple
- **LIVE / RIGHT NOW** → Present Continuous

The player is a Time Explorer moving through six locations and repairing the timeline.

The first five levels each restore one Time Core.

Canonical total:

```js
const TOTAL_CORES = 5;
```

After collecting all five cores, the player enters:

**Level 6 — Time Core Chamber**

The final chamber requires speaking to restore the timeline completely.

---

# 2. Learning goal

The learner should practise:

1. recognizing Present Simple vs Present Continuous;
2. recognizing and using signal words;
3. choosing the correct verb form;
4. building affirmative sentences;
5. using negatives;
6. using questions;
7. correcting tense mistakes;
8. comparing routine vs what is happening now;
9. producing both tenses orally.

---

# 3. Grammar canon

## Present Simple

Use for routines, habits, repeated actions and facts.

Patterns:

```text
I / You / We / They + base verb
He / She / It + verb-s
```

Negative:

```text
I / You / We / They don't + base verb
He / She / It doesn't + base verb
```

Question:

```text
Do + I/you/we/they + base verb?
Does + he/she/it + base verb?
```

## Present Continuous

Use for actions happening now.

Patterns:

```text
I am + verb-ing
He / She / It is + verb-ing
You / We / They are + verb-ing
```

Negative:

```text
am not / isn't / aren't + verb-ing
```

Question:

```text
Am / Is / Are + subject + verb-ing?
```

---

# 4. Signal words canon

## ROUTINE — Present Simple

Core signal words:

```text
always
usually
often
sometimes
never
every day
every week
on Mondays
```

## LIVE — Present Continuous

Core signal words:

```text
now
right now
at the moment
Look!
Listen!
```

Optional extension only when the sentence clearly describes a temporary current situation:

```text
today
this week
```

Do not teach `today` or `this week` as an absolute rule by themselves.

---

# 5. Project structure

Use a static site. No server is required.

If the repository is currently empty, use this structure:

```text
/
├── index.html
├── css/
│   ├── base.css
│   ├── game.css
│   ├── responsive.css
│   └── animations.css
├── js/
│   ├── app.js
│   ├── assets.js
│   ├── audio.js
│   ├── input.js
│   ├── storage.js
│   ├── scoring.js
│   ├── ui.js
│   ├── game-state.js
│   ├── level-engine.js
│   └── data/
│       └── levels.js
├── images/
│   └── ...
└── sounds/
    └── ...
```

Use standard HTML/CSS/JavaScript with ES modules.

Do not add React, Vue, a backend, a database, authentication, analytics, or a large dependency chain unless the repository already uses such a stack.

If an existing project structure already exists, preserve it and implement the same behavior using the current stack.

---

# 6. GitHub Pages rules

This game must publish correctly from a repository subpath.

Never use asset paths beginning with `/`.

Bad:

```text
/images/bg.png
```

Good:

```text
images/bg.png
./images/bg.png
```

For JS asset resolution, relative URLs are preferred.

The app must work when hosted at a URL shaped like:

```text
https://username.github.io/repository-name/
```

Do not assume the app is hosted at the domain root.

No runtime network requests are required for core gameplay.

---

# 7. Canonical heroine

Use only the approved Time Glitch heroine.

Visual identity:

- long chestnut-brown hair;
- green eyes;
- white and teal explorer top;
- shorts;
- dark tights;
- teal footwear;
- time-tech backpack / time-crystal details;
- friendly child adventure-game appearance.

Do not use:

- alternative girls from old sprite sheets;
- the blue-haired holographic girl;
- the boy from old sprite sheets;
- redesigned faces;
- redesigned clothes.

The approved character sheet is the source of truth.

A small friendly robot companion may be used decoratively if the approved asset is available.

---

# 8. Player movement

## Desktop

The heroine should visually move toward the mouse cursor inside the playable scene.

Use a smooth target system:

```text
pointer position -> target position -> eased character movement
```

Requirements:

- no teleporting;
- smooth easing / lerp;
- clamp movement inside the walkable scene;
- do not allow the character to cover important HUD;
- flip the sprite horizontally depending on movement direction;
- use a walking pose/animation while moving;
- switch to idle when stopped.

The character does not need physics.

## Clicking an interactive object

If a clickable object is close enough:

- open the task.

If it is farther away:

1. set the object position as the movement target;
2. make the heroine walk toward it;
3. open the task automatically when she reaches interaction range.

This prevents frustrating precision clicking.

## Mobile

There is no mouse cursor.

Use unified Pointer Events:

- tap empty scene → move toward the tapped position;
- tap an interactive object → walk to the object and activate it;
- optional touch-drag may continuously update movement target.

Do not require hover to play.

---

# 9. Footstep behavior

Play footsteps only while the heroine is actually moving.

Requirements:

- rate-limit footsteps;
- do not restart audio on every `pointermove`;
- vary timing slightly if possible;
- stop immediately when idle;
- respect sound mute state.

---

# 10. Start screen

The first screen must contain:

- game title: **TIME GLITCH**
- short mission intro;
- player setup;
- sound button;
- fullscreen button;
- `START MISSION`;
- last saved result summary if one exists;
- a very subtle reset control.

## Player setup

Allow:

```text
1 to 7 players
```

Workflow:

1. choose number of players;
2. show exactly that many name inputs;
3. enter player names;
4. start.

Validation:

- names cannot be blank;
- trim whitespace;
- maximum approximately 16 visible characters;
- always render user-provided names with safe text APIs, never unsanitized HTML.

---

# 11. Turn system

The current player must always be visible.

Example:

```text
YOUR TURN
SOFIA
```

or:

```text
SOFIA'S TURN
```

The current player indicator must be compact and readable.

After a scored challenge is completed:

```js
currentPlayerIndex =
  (currentPlayerIndex + 1) % players.length;
```

Important:

**Do not reset the current player index when changing levels.**

This makes the distribution of turns fairer across the whole game.

A completed challenge cannot be farmed repeatedly for extra score.

Reopening a completed task is allowed only in **review mode** with zero score.

---

# 12. Multiplayer pacing rule

The number of game challenges must **not multiply by player count**.

For example:

- 1 player does not get 20 × 1 unique copies;
- 7 players do not get 20 × 7 challenges.

There is one shared mission with a fixed set of challenges.

Players take turns solving them.

This is essential for keeping the total session near 40 minutes.

---

# 13. Scoring

## Per normal challenge

Maximum:

```text
100 points
```

### First attempt correct

```text
+100
```

### Correct on second attempt without a hint

```text
+70
```

### Hint used, or correct after additional attempts

```text
+50
```

Do not subtract already-earned points.

Do not use negative scores.

Do not use harsh failure language.

## Speaking challenge

Each required speaking prompt completed:

```text
+150 possible points
```

---

# 14. Fair ranking for 1–7 players

Because a fixed number of turns cannot always be divided evenly by 1–7 players, do **not** rank players by raw total alone.

Track:

```js
player.earnedPoints
player.maxPossibleAssignedPoints
```

Compute:

```js
normalizedScore =
  Math.round(
    1000 *
    player.earnedPoints /
    player.maxPossibleAssignedPoints
  );
```

Display the normalized score as the main final score:

```text
0–1000
```

This prevents a player from winning simply because they happened to receive one extra turn.

Also track raw metrics for the results screen.

Tie-break order:

1. higher normalized score;
2. higher first-try success rate;
3. fewer hints used;
4. equal place if still tied.

---

# 15. Wrong-answer behavior

A wrong answer should feel like a normal learning moment.

On wrong answer:

- play a soft incorrect sound;
- small gentle shake/pulse;
- no scary red screen;
- do not say `GAME OVER`;
- allow another attempt.

After first wrong attempt:

- keep the task open;
- score cap becomes 70.

After hint is used:

- score cap becomes 50.

After repeated errors:

- reveal the relevant signal word or grammar hint;
- let the learner complete the task;
- never hard-lock the game.

---

# 16. Hint system

Every scored task has one **HINT** button.

Hint examples:

```text
Look at the signal word.
```

```text
"usually" tells us this is a routine.
```

```text
For RIGHT NOW, use am / is / are + verb-ing.
```

```text
After "doesn't", use the base verb.
```

Once a hint is used:

```js
task.hintUsed = true;
player.hintsUsed += 1;
```

---

# 17. Interaction model for tasks

Avoid desktop-only drag and drop.

Use mobile-friendly interaction patterns:

- tap a token, then tap a category;
- tap answer cards;
- tap word chips in order;
- tap to select a pair;
- tap `CHECK`;
- tap `TRY AGAIN`.

All interactive targets should be approximately **44 px or larger** on touch devices.

---

# 18. Game progress

There are five collectable Time Cores.

After each of Levels 1–5 is fully completed:

1. core animation;
2. collect sound;
3. progress indicator increases;
4. transition unlocks.

Example:

```text
TIME CORES
3 / 5
```

Render numbers with HTML/CSS.

Do not rely on text embedded inside an image.

---

# 19. Time Scanner reference panel

A compact scanner/reference panel can be opened when useful.

It shows:

## ROUTINE

```text
Present Simple

always
usually
often
sometimes
never
every day
on Mondays
```

## LIVE

```text
Present Continuous

now
right now
at the moment
Look!
Listen!
```

This is a learning aid, not a popup that constantly blocks the screen.

---

# 20. LEVEL 1 — CITY SQUARE
## Signal Scan

### Learning purpose

Recognize signal words and make the first distinction between:

```text
ROUTINE
LIVE
```

### Visual goal

A bright magical sci-fi city square.

Use the approved City Square background and approved separate objects.

Suggested interactive assets:

```text
time-terminal
signal-chip
hologram-pedestal
time-core
```

The mouse and small environmental objects are decorative.

### Challenge 1 — Signal Sort

Type:

```text
tap-to-sort
```

Instruction:

```text
Sort the time signals.
```

Tokens:

```text
always
now
usually
right now
often
at the moment
every day
never
```

Correct:

```js
ROUTINE = [
  "always",
  "usually",
  "often",
  "every day",
  "never"
];

LIVE = [
  "now",
  "right now",
  "at the moment"
];
```

Hint:

```text
Routine = something that happens again and again.
Live = something happening now.
```

### Challenge 2 — Routine Sentence

Question:

```text
Lena ___ her homework every day.
```

Options:

```text
does
is doing
```

Answer:

```text
does
```

Signal:

```text
every day
```

### Challenge 3 — Live Sentence

Question:

```text
Look! The drone ___ over the square.
```

Options:

```text
flies
is flying
```

Answer:

```text
is flying
```

Signal:

```text
Look!
```

### Challenge 4 — Quick Scan

Classify each:

```text
on Mondays
Listen!
sometimes
right now
```

Answers:

```text
on Mondays -> Present Simple
Listen! -> Present Continuous
sometimes -> Present Simple
right now -> Present Continuous
```

### Level completion

Award:

```text
TIME CORE 1 / 5
```

---

# 21. LEVEL 2 — METRO STATION
## Choose the Correct Form

### Learning purpose

Choose Present Simple or Present Continuous based on meaning and signal words.

Suggested interactive assets:

```text
ticket-machine
phone
maintenance-panel
station-display
```

Decorative / animated assets may include:

```text
train
hanging-light
metro-mouse
neon-strip
steam
```

### Challenge 1 — Ticket Machine

Question:

```text
The train usually ___ at 8 o'clock.
```

Options:

```text
arrives
is arriving
```

Answer:

```text
arrives
```

Signal:

```text
usually
```

### Challenge 2 — Platform

Question:

```text
We ___ for the train right now.
```

Options:

```text
wait
are waiting
```

Answer:

```text
are waiting
```

Signal:

```text
right now
```

### Challenge 3 — Negative

Prompt:

```text
Tom travels by metro every day.
Choose the correct negative sentence.
```

Options:

```text
Tom doesn't travel by metro every day.
Tom isn't travelling by metro every day.
```

Answer:

```text
Tom doesn't travel by metro every day.
```

### Challenge 4 — Question

Prompt:

```text
Mia is on the platform now.
Choose the correct question.
```

Options:

```text
Does Mia wait on the platform now?
Is Mia waiting on the platform now?
```

Answer:

```text
Is Mia waiting on the platform now?
```

### Level completion

Award:

```text
TIME CORE 2 / 5
```

---

# 22. LEVEL 3 — SHOPPING MALL
## Build the Sentence

### Learning purpose

Build correct affirmative, negative and question forms.

Suggested interactive assets:

```text
mall-ad-panel
shopping-bag
directory-screen
vending-machine
```

Animated layers:

```text
escalator
elevator-indicator
distant-silhouettes
storefront-glow
floor-shimmer
```

### Challenge 1 — Present Simple Word Order

Instruction:

```text
Build the sentence.
```

Word chips:

```text
she
usually
buys
fruit
here
```

Answer:

```text
She usually buys fruit here.
```

### Challenge 2 — Present Continuous Word Order

Word chips:

```text
they
are
looking
at
the map
right now
```

Answer:

```text
They are looking at the map right now.
```

### Challenge 3 — Negative Form

Question:

```text
Ben ___ a jacket every day.
```

Meaning:

```text
negative routine
```

Options:

```text
doesn't wear
isn't wearing
don't wears
```

Answer:

```text
doesn't wear
```

### Challenge 4 — Question Form

Prompt:

```text
The children are choosing a drink at the moment.
Choose the correct question.
```

Options:

```text
Do the children choose a drink at the moment?
Are the children choosing a drink at the moment?
```

Answer:

```text
Are the children choosing a drink at the moment?
```

### Level completion

Award:

```text
TIME CORE 3 / 5
```

---

# 23. LEVEL 4 — ROBOT FACTORY
## Repair the Grammar System

### Learning purpose

Spot tense errors and repair forms.

Suggested interactive assets:

```text
robot-control-terminal
assembly-robot-arm
parts-crate
maintenance-panel
```

Animated layers:

```text
conveyor-belt
moving-robot-arm
sparks
steam
factory-light-flicker
```

### Challenge 1 — Fix the Live Sentence

Broken sentence:

```text
The robot is check the box now.
```

Options:

```text
The robot checks the box now.
The robot is checking the box now.
The robot checking the box now.
```

Answer:

```text
The robot is checking the box now.
```

### Challenge 2 — Fix the Routine Sentence

Broken sentence:

```text
This machine usually is making small parts.
```

Options:

```text
This machine usually makes small parts.
This machine is usually making small parts.
This machine usually make small parts.
```

Answer:

```text
This machine usually makes small parts.
```

### Challenge 3 — Choose the Routine Form

Question:

```text
The engineers ___ the system every morning.
```

Options:

```text
check
are checking
checks
```

Answer:

```text
check
```

### Challenge 4 — Choose the Live Form

Question:

```text
Listen! The robot ___ a warning sound.
```

Options:

```text
makes
is making
make
```

Answer:

```text
is making
```

### Level completion

Award:

```text
TIME CORE 4 / 5
```

---

# 24. LEVEL 5 — CONTROL TOWER
## Routine or Right Now?

### Learning purpose

Compare a person's normal routine with what the person is doing right now.

This is the strongest mixed-practice level before speaking.

Suggested interactive assets:

```text
surveillance-camera
control-console
profile-terminal
hologram-platform
```

Animated background layers:

```text
flying-drones
moving-sky-traffic
holographic-hud-flicker
city-lights-twinkle
distant-tower-movement
```

### Challenge 1 — Surveillance Feed

Profile:

```text
Mia usually walks to school.
```

Live feed:

```text
Right now she is riding a scooter.
```

Show four cards.

Correct pair:

```text
Mia usually walks to school.
Right now she is riding a scooter.
```

Incorrect distractors should swap the tense forms.

### Challenge 2 — Signal Word

Question:

```text
Leo ___ football after school.
```

Target meaning:

```text
routine
```

Choose the best signal:

```text
usually
right now
at the moment
```

Answer:

```text
usually
```

Then complete:

```text
Leo usually plays football after school.
```

### Challenge 3 — Agent Profile

Routine:

```text
Emma often drinks tea in the morning.
```

Live:

```text
At the moment she is drinking juice.
```

Ask the learner to select both correct sentences from four options.

### Challenge 4 — Rapid Mixed Scan

Classify:

```text
Dad is cooking right now.
We usually play games on Friday.
Listen! The baby is crying.
Anna sometimes reads before bed.
They are running at the moment.
Sam never drinks coffee.
```

Answers:

```text
Dad is cooking right now. -> Present Continuous
We usually play games on Friday. -> Present Simple
Listen! The baby is crying. -> Present Continuous
Anna sometimes reads before bed. -> Present Simple
They are running at the moment. -> Present Continuous
Sam never drinks coffee. -> Present Simple
```

### Level completion

Award:

```text
TIME CORE 5 / 5
```

Unlock:

```text
TIME CORE CHAMBER
```

---

# 25. LEVEL 6 — TIME CORE CHAMBER
## Voice Access Required
## Final Speaking Level

### Learning purpose

The learner must produce both tenses orally.

Do not pretend to automatically understand or grade spoken grammar without a reliable speech-analysis backend.

The core game must work without speech recognition.

### Speaking interaction

Display:

```text
VOICE ACCESS REQUIRED
```

The learner speaks aloud.

Then use one of these completion flows:

### Preferred classroom flow

Buttons:

```text
TRY AGAIN
COMPLETED
```

The teacher or learner confirms completion.

### Optional recording enhancement

If `MediaRecorder` is supported:

- allow short local recording;
- never upload audio;
- do not store recordings in localStorage;
- keep recording only in memory;
- discard it after leaving the speaking screen.

Recording is optional and must have a fallback.

### Prompt count

Use:

```js
if (playerCount === 1) promptsPerPlayer = 3;
else if (playerCount <= 2) promptsPerPlayer = 2;
else promptsPerPlayer = 1;
```

This keeps the full mission within the target lesson time.

### Core speaking prompt

Every player must receive at least one prompt requiring both tenses:

```text
Tell us one thing you usually do
and one thing you are doing right now.
Use a signal word in each sentence.
```

Expected model:

```text
I usually read after school.
Right now I am playing Time Glitch.
```

### Additional solo / small-group prompts

Routine:

```text
Tell us two things you usually do after school.
Use usually, often, always, sometimes or never.
```

Live:

```text
Look at the scene.
Say two things that are happening right now.
Use now, right now or at the moment.
```

Comparison:

```text
Finish:
"I usually ..., but right now I am ..."
```

### Speaking scoring

Each required prompt has a maximum of:

```text
150
```

Do not automatically mark grammar based on microphone audio.

Completion may be manually confirmed.

---

# 26. Target session timing

Approximate pacing:

```text
Start / names                2 min
Level 1                      5 min
Level 2                      5 min
Level 3                      5 min
Level 4                      5 min
Level 5                      6 min
Level 6 speaking             8–10 min
Victory / results            2 min
---------------------------------
Total                        ~38–40 min
```

Do not add unnecessary extra tasks that push the standard route far beyond 40 minutes.

---

# 27. Living environments

The scenes should not look like static worksheets.

Use subtle independent movement.

## City Square

Examples:

- leaves / branches moving lightly;
- small drone crossing;
- mouse occasionally running;
- small crystal particles;
- gentle hologram movement.

## Metro Station

Examples:

- train movement;
- subtle steam;
- light flicker;
- hanging lamp movement;
- mouse movement;
- neon pulse.

## Shopping Mall

Examples:

- escalator motion;
- elevator indicator;
- distant silhouettes;
- storefront glow;
- floor reflection shimmer.

## Robot Factory

Examples:

- robot arm;
- conveyor belt;
- sparks;
- steam;
- factory light flicker.

## Control Tower

Examples:

- drones outside;
- distant air traffic;
- hologram flicker;
- city lights;
- tiny distant movement.

## Time Core Chamber

Examples:

- rotating rings;
- energy beams;
- core pulse;
- floating particles;
- soft holograms.

---

# 28. Animation performance

Animations must stay lightweight.

Prefer:

- CSS transforms;
- opacity;
- background-position;
- small DOM particle pools.

Avoid:

- hundreds of DOM particles;
- constant layout thrashing;
- heavy WebGL;
- huge canvas loops when CSS is sufficient.

When:

```js
document.hidden === true
```

pause or reduce non-essential animation.

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

On lower-width mobile screens, reduce the number of decorative particles.

---

# 29. Audio design

**No background music.**

Use small SFX only.

Expected logical sounds:

```text
sfx-hover
sfx-click
sfx-footstep-1
sfx-footstep-2
sfx-rustle
sfx-task-open
sfx-correct
sfx-incorrect
sfx-hint
sfx-collect
sfx-turn-change
sfx-portal
sfx-core-charge
sfx-energy-pulse
sfx-system-restored
sfx-results-open
sfx-button-confirm
```

If actual filenames differ, map logical IDs in `audio.js`.

The game must not crash if a sound file is missing.

## Browser autoplay restriction

Do not attempt to play audio before the first user interaction.

Unlock audio after:

```text
pointerdown / click / key interaction
```

## Hover sound

Only use hover sound where hover truly exists.

Do not repeatedly spam it on touch devices.

---

# 30. Sound settings

Use one sound toggle.

Store preference locally:

```text
sound on/off
```

No music toggle is needed because there is no background music.

---

# 31. Fullscreen

Provide a fullscreen control from the beginning.

Use the Fullscreen API where available.

Requirements:

- keep game state;
- do not reload;
- support entering/exiting during gameplay;
- continue working on victory/results screens.

If full Fullscreen API is not available, use a graceful CSS immersive layout fallback.

Do not crash or hide the button awkwardly.

---

# 32. Responsive layout

## Desktop

Primary scene is designed around **16:9**.

The background should:

- fill the scene;
- preserve aspect ratio;
- avoid stretching;
- keep interactive objects aligned to percentage-based coordinates.

Use a bounded responsive stage rather than absolute pixel positioning across the browser window.

## Mobile landscape

Must be fully playable.

- compact HUD;
- large touch targets;
- scene remains readable;
- task modal may use most of the screen.

## Mobile portrait

Must still function.

Do not block the game completely.

A small optional hint may say:

```text
For a bigger game view, rotate your phone.
```

But portrait mode must remain usable.

Do not create horizontal page scrolling.

---

# 33. HUD safe zones

Important HUD zones:

- top-left: current player;
- top-center or top: level/core progress;
- top-right: sound/fullscreen;
- bottom corners: optional hint/reference controls.

The heroine and interactive objects must not permanently sit under these zones.

Use percentage-based safe areas.

---

# 34. Task modal

Task modal must:

- be readable on desktop/mobile;
- dim the game scene but keep context visible;
- have clear task title;
- show signal words where relevant;
- have large answer controls;
- have HINT;
- have CHECK;
- show feedback;
- close after completion.

Do not put long instructions into image files.

Use HTML text.

---

# 35. Visual text rule

Never bake dynamic interface text into PNG assets.

Render via HTML/CSS:

- player name;
- `YOUR TURN`;
- level number;
- signal words;
- grammar labels;
- task text;
- answer options;
- score;
- `x / 5`;
- results;
- buttons;
- ranking;
- victory text.

This keeps text sharp and responsive.

---

# 36. Asset loading strategy

At startup:

1. scan/use the known logical manifest;
2. preload the current background and essential HUD;
3. lazy-load later-level decorative images;
4. do not block the entire game on non-essential decorative assets.

Use `loading="lazy"` where applicable outside the active stage.

For level transitions, preload the next background shortly before transition.

---

# 37. Canonical image manifest

Expected logical structure:

```text
images/
├── character/
│   ├── hero-character-sheet.png
│   └── companion-robot.png
│
├── backgrounds/
│   ├── bg-city-square.png
│   ├── bg-metro-station.png
│   ├── bg-shopping-mall.png
│   ├── bg-robot-factory.png
│   ├── bg-control-tower.png
│   └── bg-time-core-chamber.png
│
├── city-square/
│   ├── time-terminal.png
│   ├── signal-chip.png
│   ├── time-core.png
│   ├── hologram-pedestal.png
│   └── mouse.png
│
├── metro-station/
│   ├── ticket-machine.png
│   ├── phone.png
│   ├── maintenance-panel.png
│   ├── station-display.png
│   ├── train.png
│   ├── hanging-light.png
│   ├── metro-mouse.png
│   ├── neon-strip.png
│   └── steam.png
│
├── shopping-mall/
│   ├── mall-ad-panel.png
│   ├── shopping-bag.png
│   ├── directory-screen.png
│   ├── vending-machine.png
│   ├── escalator.png
│   ├── elevator-indicator.png
│   ├── distant-silhouettes.png
│   └── storefront-glow.png
│
├── robot-factory/
│   ├── robot-control-terminal.png
│   ├── assembly-robot-arm.png
│   ├── parts-crate.png
│   ├── maintenance-panel.png
│   ├── conveyor-belt.png
│   ├── sparks.png
│   └── steam.png
│
├── control-tower/
│   ├── surveillance-camera.png
│   ├── control-console.png
│   ├── profile-terminal.png
│   └── hologram-platform.png
│
├── time-core-chamber/
│   ├── time-core-console.png
│   ├── voice-access-panel.png
│   ├── time-comparator-display.png
│   ├── time-tube-portal.png
│   ├── rotating-time-rings.png
│   ├── energy-beams.png
│   └── ambient-particles.png
│
└── ui/
    ├── ui-task-panel.png
    ├── ui-turn-panel.png
    ├── ui-button-primary.png
    ├── ui-button-icon.png
    ├── icon-sound-on.png
    ├── icon-sound-off.png
    ├── icon-fullscreen.png
    ├── icon-map.png
    ├── icon-reset.png
    ├── time-scanner-frame.png
    ├── time-core-progress.png
    └── time-energy-icon.png
```

Actual filenames on disk may differ.

Create one central mapping module:

```js
export const ASSETS = {
  hero: "...",
  backgrounds: {
    citySquare: "...",
    metroStation: "...",
    shoppingMall: "...",
    robotFactory: "...",
    controlTower: "...",
    timeCoreChamber: "..."
  }
};
```

Do not spread raw filenames throughout the codebase.

Do not rename or delete user files automatically.

---

# 38. Old asset sheets — exclusion rules

Do not use entire experimental collage sheets as live game screens.

They are references/donors only.

Explicitly exclude:

- alternative heroine designs;
- blue-haired holographic girl;
- boy character;
- red hostile drones;
- enemy mechanics;
- random forest location;
- cave location;
- sunset floating-island location;
- duplicate HUD;
- duplicate portals;
- duplicate crystals;
- duplicate City Square backgrounds.

There are exactly six canonical levels.

---

# 39. Visual style

Overall:

```text
premium cinematic 3D cyber-fantasy adventure
child-friendly
polished
bright but not childish
high-tech + magical time-crystal world
```

Core palette:

```text
deep navy
cyan
teal
blue
violet
white
small controlled gold accents
```

Avoid a global yellow tint.

Level 4 may use controlled industrial amber/orange accents.

Do not turn the whole project into dark horror cyberpunk.

---

# 40. Game state model

Recommended:

```js
const gameState = {
  status:
    "setup" |
    "playing" |
    "task" |
    "transition" |
    "speaking" |
    "restoring" |
    "victory" |
    "results" |
    "completed",

  currentLevel: 1,
  currentPlayerIndex: 0,
  collectedCores: 0,

  players: [],

  completedTasks: new Set(),

  settings: {
    soundEnabled: true,
    fullscreenRequested: false
  }
};
```

A player record can look like:

```js
{
  id: "p1",
  name: "Sofia",

  earnedPoints: 0,
  maxPossibleAssignedPoints: 0,

  assignedTasks: 0,
  completedTasks: 0,

  firstTryCorrect: 0,
  totalCorrect: 0,

  hintsUsed: 0,
  speakingCompleted: 0
}
```

---

# 41. Task data model

Keep content in data, not DOM code.

Example:

```js
{
  id: "L2-T1",
  level: 2,
  type: "mcq",
  objectId: "ticket-machine",

  instruction: "Choose the correct form.",
  prompt: "The train usually ___ at 8 o'clock.",

  options: [
    "arrives",
    "is arriving"
  ],

  answer: "arrives",

  signalWord: "usually",

  hint:
    '"usually" tells us this is a routine.'
}
```

Supported types:

```text
mcq
tap-sort
word-order
select-pair
rapid-sort
speaking
```

Implement reusable renderers.

Do not custom-code 20 unrelated task screens.

---

# 42. Level engine

Each level config should contain:

```js
{
  id,
  title,
  subtitle,
  background,
  objects,
  tasks,
  ambientLayers,
  coreReward
}
```

Core reward:

```js
coreReward: level <= 5
```

When all required level tasks are completed:

- award core;
- lock score farming;
- play completion effect;
- show short transition;
- load next level.

---

# 43. Level transition

Keep transitions short:

```text
1. task complete
2. core pulse
3. core collected
4. portal / wipe / glow
5. next scene
```

Target:

```text
1.5–3 seconds
```

No long loading animation.

---

# 44. Saved data

Use local storage only.

Suggested keys:

```text
timeGlitch:settings
timeGlitch:lastCompletedRun
timeGlitch:resultHistory
```

Do not send names, scores or audio to any server.

No analytics are required.

No cookies are required.

---

# 45. Result history

At minimum, store the most recent completed mission.

Optional:

- keep the last 10 completed runs locally.

Do not create a cloud leaderboard.

---

# 46. Main-screen result preview

If a completed result exists:

```text
LAST MISSION

Sofia — 886
Max — 804
Anna — 792
```

Keep it compact.

A small `RESULTS` button may open the latest detailed results.

---

# 47. Subtle reset

A small low-emphasis reset control must exist on the main screen.

It should not compete visually with `START MISSION`.

On click:

```text
Reset all saved results?
```

Buttons:

```text
RESET
CANCEL
```

Never wipe saved results from one accidental click.

---

# 48. Final restoration sequence

After the final required speaking prompt:

1. block normal level interaction briefly;
2. central Time Core glows brighter;
3. rotating rings accelerate slightly;
4. three energy pulses radiate outward;
5. cyan/violet particles appear;
6. short light flash;
7. show:

```text
TIME SYSTEM RESTORED
```

Subtitle:

```text
The timeline is stable again.
```

Duration:

```text
4–6 seconds
```

Then show results.

No separate video is required.

---

# 49. Victory screen

Text:

```text
TIME SYSTEM RESTORED
```

For one player:

```text
Great work, Time Explorer!
```

For multiple players:

```text
Great work, Time Explorers!
```

Then:

```text
VIEW RESULTS
```

Do not immediately jump from the last answer to a spreadsheet-like score table.

The child should feel that the mission ended successfully.

---

# 50. Results screen

Must support:

```text
1–7 players
```

For each player show:

- name;
- normalized score 0–1000;
- tasks completed;
- first-try correct;
- accuracy;
- hints used;
- speaking completion.

For multiple players:

- rank by normalized score;
- apply tie-break rules.

For one player:

Do not show:

```text
1st place
```

Show:

```text
MISSION COMPLETE
```

---

# 51. Accuracy metrics

Track:

```js
accuracy =
  totalCorrect /
  completedTasks;
```

Track first try rate separately:

```js
firstTryRate =
  firstTryCorrect /
  completedTasks;
```

Guard against division by zero.

Display rounded percentages.

---

# 52. Results buttons

Primary:

```text
PLAY AGAIN
```

Secondary:

```text
MAIN SCREEN
```

## Play Again

Open confirmation:

```text
Start a new game?
```

Buttons:

```text
YES, START NEW GAME
CANCEL
```

After confirmation:

- archive current result;
- reset current run state;
- keep existing player names prefilled;
- allow player edits;
- restart at Level 1.

## Main Screen

- save completed result;
- return to start screen;
- keep LAST MISSION visible.

---

# 53. Final SFX

Final sequence may use:

```text
sfx-core-charge
sfx-energy-pulse
sfx-system-restored
sfx-results-open
sfx-button-confirm
```

Still no background music.

---

# 54. Privacy behavior

This game is for children, so keep the implementation simple and private.

- names remain local in the browser;
- no account system;
- no remote database;
- no analytics;
- no advertising code;
- no uploaded microphone recording;
- no remote speech recognition required.

If optional audio recording is implemented:

- request permission only when the learner explicitly taps record;
- keep audio only in memory;
- provide a clear stop/delete behavior;
- discard it when leaving the speaking task.

---

# 55. Accessibility

Implement:

- visible keyboard focus;
- meaningful button labels;
- `aria-label` for icon-only buttons;
- keyboard activation;
- reduced-motion support;
- sufficient text contrast;
- no information conveyed only by color;
- no mandatory hover.

Interactive object hotspots should also be reachable from the keyboard, for example through an object navigator / tab order.

---

# 56. Error handling

The game should not fail because one decorative file is absent.

For missing decorative image:

- log a clear warning;
- omit that decoration.

For missing required background or heroine:

- show a clean CSS fallback;
- log the exact missing logical asset.

For missing sound:

- remain silent for that SFX;
- do not throw an uncaught error.

For unsupported fullscreen:

- use normal responsive mode.

For unsupported MediaRecorder:

- use manual speaking completion.

---

# 57. No accidental page behavior

Inside the game stage:

- avoid image dragging;
- avoid accidental text selection on gameplay controls;
- prevent touch scrolling only where necessary;
- do not globally break normal browser accessibility.

Do not hijack keyboard shortcuts unnecessarily.

---

# 58. Visual feedback

## Interactive object available

- subtle cyan pulse;
- slight glow;
- optional tiny floating indicator.

## Hover / focus

- stronger glow;
- very small scale change;
- optional hover SFX.

## Completed

- small check/state marker;
- stop the attention pulse;
- object remains visually present.

## Correct

- green/cyan success pulse;
- correct SFX;
- score feedback.

## Incorrect

- amber/soft red micro-shake;
- soft incorrect SFX;
- no giant red overlay.

---

# 59. Mobile task layout

For narrow screens:

- modal becomes nearly full-screen;
- answer cards stack vertically;
- word chips wrap;
- categories remain easy to tap;
- fixed action row may sit near bottom safe area;
- use `env(safe-area-inset-bottom)` where useful.

Do not place important controls under phone browser bars.

---

# 60. Performance budget principles

Prefer optimized backgrounds such as WebP when the user already has them or when safe copies can be created without destroying originals.

Do not silently delete or overwrite source PNGs.

Avoid loading all six full-resolution backgrounds immediately.

Preload:

```text
current level
next level
global HUD
hero
```

Lazy-load the rest.

---

# 61. Build order for Codex

Implement in this order.

## Phase 1 — Foundation

- inspect repository;
- inspect `images/`;
- inspect `sounds/`;
- create central asset/audio maps;
- start screen;
- player setup;
- state management;
- responsive game stage;
- sound/fullscreen.

## Phase 2 — Movement

- heroine pointer movement;
- touch movement;
- walking/idle states;
- footsteps;
- interaction range.

## Phase 3 — Task engine

Build reusable:

- mcq;
- tap-sort;
- word-order;
- pair select;
- rapid sort;
- speaking.

Add hints and scoring.

## Phase 4 — Levels 1–5

Implement all 20 scored challenges.

Add core progress.

## Phase 5 — Level 6

Implement speaking flow and optional local recording fallback.

## Phase 6 — Living layers

Add controlled ambient animations.

## Phase 7 — Results/final

Add restoration, victory, results, localStorage, replay.

## Phase 8 — QA

Test every target size and GitHub Pages path behavior.

---

# 62. Do not do these things

Do not:

- add a seventh level;
- add combat;
- add red enemy drones;
- add health/hearts;
- add lives;
- add `GAME OVER`;
- add background music;
- replace the heroine;
- use the wrong generated character;
- add random forest/cave levels;
- add a backend;
- add cloud login;
- add a cloud leaderboard;
- auto-grade spoken grammar without a reliable backend;
- use absolute-root asset paths;
- require drag-and-drop that fails on touch;
- bake dynamic text into PNG;
- make the 7-player mode seven times longer;
- make reset immediate;
- delete the user's source assets.

---

# 63. Canonical UI text

Useful recurring labels:

```text
TIME GLITCH
START MISSION
YOUR TURN
TIME CORES
ROUTINE
LIVE
PRESENT SIMPLE
PRESENT CONTINUOUS
SIGNAL WORDS
HINT
CHECK
TRY AGAIN
CONTINUE
VOICE ACCESS REQUIRED
COMPLETED
TIME SYSTEM RESTORED
VIEW RESULTS
MISSION COMPLETE
PLAY AGAIN
MAIN SCREEN
LAST MISSION
RESULTS
```

---

# 64. Definition of Done — gameplay

The game is not complete until:

- all six canonical locations exist;
- Levels 1–5 each contain four functioning challenges;
- signal words are present throughout the game;
- Level 6 contains speaking;
- heroine moves properly;
- mouse and touch work;
- player turns rotate;
- 1–7 players work;
- no challenge can be farmed for points;
- hints affect score correctly;
- normalized ranking is fair;
- five cores can be collected;
- Level 6 unlocks after 5/5;
- final sequence triggers;
- results display correctly.

---

# 65. Definition of Done — technical

Also verify:

- no uncaught console errors;
- GitHub Pages relative asset paths work;
- reload does not break the start screen;
- latest completed result persists;
- reset confirmation works;
- sound toggle persists;
- missing SFX does not crash;
- fullscreen graceful fallback works;
- no horizontal page scroll;
- keyboard focus is visible;
- `prefers-reduced-motion` works;
- mobile touch targets are large enough.

---

# 66. Required viewport QA

Manually test at least:

```text
1920 × 1080
1366 × 768
1024 × 768
768 × 1024
430 × 932
390 × 844
360 × 800
```

Also test:

- phone portrait;
- phone landscape;
- fullscreen;
- non-fullscreen;
- sound on/off;
- 1 player;
- 2 players;
- 7 players.

---

# 67. Required content QA

Verify each grammar answer manually.

Especially check:

```text
doesn't + base verb
does + base verb
am/is/are + verb-ing
third-person -s
signal-word / tense pairing
```

Do not create distractors that are accidentally also grammatically correct in the intended context.

---

# 68. Required GitHub Pages QA

Before declaring completion:

1. build/run locally using a local web server;
2. verify no root-relative paths;
3. deploy to GitHub Pages;
4. open direct repository Pages URL;
5. refresh while on the game;
6. verify images/sounds still resolve;
7. verify fullscreen fallback;
8. verify localStorage result.

---

# 69. Codex completion report

When implementation is finished, report:

```text
1. Files created/changed
2. Levels implemented
3. Assets found
4. Assets missing
5. Sounds found
6. Sounds missing
7. Mobile checks
8. GitHub Pages checks
9. Any remaining known issues
```

Do not say “done” if there are known broken core paths or missing mandatory gameplay screens.

---

# 70. Final project rule

The goal is not to create the most complicated game.

The goal is a **beautiful, stable, child-friendly, 35–40 minute English grammar adventure** in which:

- the learner clearly distinguishes Present Simple and Present Continuous;
- signal words are repeatedly reinforced;
- the character feels alive;
- multiplayer stays manageable;
- the interface works on desktop and phone;
- the final speaking level feels like a real mission ending.

**Build the approved game. Do not expand the scope.**
