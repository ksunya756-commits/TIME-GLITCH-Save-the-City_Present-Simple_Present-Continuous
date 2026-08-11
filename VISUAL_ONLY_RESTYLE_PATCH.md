# TIME GLITCH — VISUAL-ONLY RESTYLE PATCH

## IMPORTANT: SCOPE

This patch is **VISUAL ONLY**.

Do NOT change:

- gameplay mechanics
- task logic
- speaking logic
- level order
- task order
- scoring
- save/load
- progress
- state management
- navigation
- modal logic
- rewards
- completion logic
- audio logic
- any other existing game behavior

Do NOT redesign the game structure.

Do NOT refactor unrelated code.

The goal of this patch is to change **only the visual presentation of the interactive locations**.

---

# 1. NEW VISUAL DIRECTION

We are replacing the old “separate marked placement-reference look” with a cleaner in-game visual approach.

## Target concept

Each level should look like:

- **one complete scene**
- **one visually unified background**
- no developer markers
- no numbers
- no object labels
- no side information panel
- no “placement index”
- no visible reference UI
- no floating annotation graphics

The player should simply see a beautiful game scene with several important objects that are visually noticeable.

---

# 2. INTERACTIVE OBJECT PRESENTATION

Each gameplay location must still contain exactly **7 clickable task objects**.

However, these objects should now be presented differently:

- they should feel like natural parts of the scene
- they should be visually integrated into the environment
- they should not look like debug markers
- they should not have labels
- they should not have visible numbering

## Visual behavior

Important clickable objects should be indicated only by visual emphasis such as:

- soft glow
- subtle cyan / blue / purple highlight
- gentle emissive outline
- mild pulse or shimmer if needed
- slightly stronger highlight on hover if hover already exists

Do not make the glow too aggressive or noisy.

The scene should stay elegant and readable.

---

# 3. ONE-SCENE LOOK

The final visual result for each level should feel like a **single composed scene**, not a scene plus separate visible placement overlays.

Important clarification:

This means **one visual scene**, not necessarily one literal code layer.

It is acceptable to keep invisible clickable hotspot elements or overlay hit areas in code if needed.

But visually, the player should perceive:

- one scene image
- embedded interactive objects
- subtle highlight on the target objects

The final screen should NOT look like a development reference board.

---

# 4. HOTSPOTS

The clickable logic may still use hotspot areas.

That is allowed.

Rules:

- hotspot zones may remain invisible
- hotspot zones may be slightly larger than the visible object
- the visible object itself should stay naturally sized
- do not add visible buttons behind objects
- do not add text labels such as “click”
- do not add numbers
- do not add debug outlines in the final player-facing version

If hover effects already exist, they may remain, but keep them visually clean.

---

# 5. USE EXISTING GAMEPLAY STRUCTURE

The mapping of objects to tasks should remain exactly as it currently works.

Do NOT change:

- which task opens from which level
- the number of tasks
- the number of speaking tasks
- completion rules
- task content
- grammar content
- answer checking
- level unlocking

Only the visual presentation should change.

---

# 6. LOCATION-SPECIFIC RULE

Apply this new visual approach to all current gameplay locations:

- City Square
- Metro Station
- Shopping Mall
- Robot Factory
- Control Tower
- Time Core Chamber

For every location:

- keep the existing scene identity
- keep the existing gameplay
- visually present 7 clickable objects
- highlight the target objects subtly
- do not show labels or numbers

For the Time Core Chamber:

- it still contains 7 separate speaking tasks
- visually, they should follow the same clean integrated style
- no numbered speaking markers should be shown

---

# 7. REMOVE OLD VISUAL LANGUAGE

The old placement-reference style is obsolete for the actual game presentation.

Do NOT use in the final player-facing visuals:

- numbered circles
- crosshair markers
- side “Placement Index” panels
- developer captions
- reference-coordinate labels
- debug annotations
- instructional overlay boxes

These were only for planning and must not appear in the final playable scenes.

---

# 8. ART DIRECTION

Preserve the existing Time Glitch visual style.

Keep:

- high-quality polished fantasy / sci-fi look
- clean environment art
- cyan / blue / purple glow language
- readable focal hierarchy
- attractive scene composition

The target feeling is:

- magical
- polished
- readable
- game-ready
- atmospheric
- not technical / not diagrammatic

---

# 9. IMPLEMENTATION PRIORITY

If there is a conflict, use this priority:

1. existing gameplay logic
2. existing approved environment style
3. this new visual-only restyle instruction

Do not preserve old placement-reference graphics if they conflict with this new direction.

This new instruction overrides the previous visual placement-reference presentation.

---

# 10. WHAT TO CHANGE

Allowed changes:

- visual composition of scene presentation
- how interactive objects are visually shown
- glow/highlight treatment
- integration of objects into the scene
- invisible hotspot alignment
- cleanup of old overlay-style reference visuals

Not allowed:

- gameplay changes
- data changes
- logic changes
- UI system changes unless strictly necessary for the visual cleanup
- broad refactors

---

# 11. FINAL CHECK

Before finishing, verify for each location:

- the scene looks like one cohesive visual screen
- there are exactly 7 clickable task objects
- clickable objects are visually noticeable through subtle highlighting
- no visible labels are present
- no visible numbers are present
- no debug/reference overlays are present
- gameplay still behaves exactly the same
- speaking functionality remains unchanged
- save/load remains unchanged
- all other systems remain unchanged

## ABSOLUTE FINAL RULE

**CHANGE VISUAL PRESENTATION ONLY.  
DO NOT CHANGE GAMEPLAY.**
