import { ASSETS } from "./assets.js?v=clean-scenes-v4";
import { playFootstep } from "./audio.js";

export function createMovementController(stage, hero, destination, onReach, sceneObjects = [], options = {}) {
  const GROUND_Y = 79;
  const FAR_FLOOR_Y = 72;
  const WALK_WAVE_HEIGHT = .45;
  const interactive = options.interactive !== false;
  const obstacles = sceneObjects.filter((object) => object.y >= 58);
  let position = { x: Number(options.initialX) || 50, y: Number(options.initialY) || GROUND_Y };
  let target = { ...position };
  let pendingObject = null;
  let pendingArrival = null;
  let frame = 0;
  let destroyed = false;
  let scripted = false;
  let wasMoving = false;
  let lastSpriteFrame = -1;
  let cameraZoom = 1.052;

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function floorY(sceneY = GROUND_Y) {
    const depth = clamp(Number(sceneY) || GROUND_Y, 0, 100) / 100;
    return FAR_FLOOR_Y + (GROUND_Y - FAR_FLOOR_Y) * depth;
  }
  function updateCamera(speed = 0) {
    const motion = clamp(speed / .72, 0, 1);
    const targetZoom = 1.052 + motion * .032;
    cameraZoom += (targetZoom - cameraZoom) * (motion > 0 ? .075 : .045);
    stage.style.setProperty("--camera-origin-x", `${position.x}%`);
    stage.style.setProperty("--camera-origin-y", `${position.y}%`);
    stage.style.setProperty("--camera-zoom", cameraZoom.toFixed(4));
  }
  function safeTargetX(x, ignoredObject = null) {
    return obstacles.reduce((safeX, object) => {
      if (object === ignoredObject) return safeX;
      const radius = Math.max(4.5, (object.size || 8) * .52);
      if (Math.abs(safeX - object.x) >= radius) return safeX;
      const side = safeX < object.x || (safeX === object.x && position.x < object.x) ? -1 : 1;
      return clamp(object.x + side * radius, 7, 93);
    }, clamp(x, 7, 93));
  }
  function setTarget(x, _y, object = null, onArrival = null, showDestination = true) {
    const targetY = floorY(object ? object.y : _y);
    const targetX = targetY > 68 ? safeTargetX(x, object) : clamp(x, 7, 93);
    target = { x: targetX, y: targetY };
    pendingObject = object;
    pendingArrival = onArrival;
    destination.style.left = `${target.x}%`;
    destination.style.top = `${target.y}%`;
    destination.classList.toggle("visible", showDestination);
  }

  function pointFromEvent(event) {
    const rect = stage.getBoundingClientRect();
    return { x: 100 * (event.clientX - rect.left) / rect.width, y: 100 * (event.clientY - rect.top) / rect.height };
  }

  function stagePointer(event) {
    if (scripted || event.target.closest(".hotspot, .hud, .bottom-tools")) return;
    const point = pointFromEvent(event);
    setTarget(point.x, point.y);
  }
  function mouseFollow(event) {
    if (scripted || event.pointerType !== "mouse" || event.buttons || event.target.closest(".hotspot, .hud, .bottom-tools")) return;
    const point = pointFromEvent(event);
    setTarget(point.x, point.y);
  }
  if (interactive) {
    stage.addEventListener("pointerdown", stagePointer);
    stage.addEventListener("pointermove", mouseFollow);
  }

  function loop(time) {
    if (destroyed) return;
    const dx = target.x - position.x;
    const dy = target.y - position.y;
    const distance = Math.hypot(dx, dy);
    const moving = distance > .35;
    if (moving) {
      const ease = Math.min(.11, .75 / Math.max(distance, 1));
      const stepX = dx * ease;
      const stepY = dy * ease;
      position.x += stepX;
      position.y += stepY;
      updateCamera(Math.hypot(stepX, stepY));
      hero.style.left = `${position.x}%`;
      const waveLift = (Math.sin(time / 180) + 1) * .5 * WALK_WAVE_HEIGHT;
      hero.style.top = `${position.y - waveLift}%`;
      if (Math.abs(dx) > .05) hero.classList.toggle("flipped", dx < 0);
      hero.classList.add("walking");
      const spriteFrame = Math.floor(time / 230) % ASSETS.hero.walk.length;
      if (spriteFrame !== lastSpriteFrame) {
        hero.querySelector("img").src = ASSETS.hero.walk[spriteFrame];
        lastSpriteFrame = spriteFrame;
      }
      playFootstep();
    } else {
      updateCamera();
      if (wasMoving) {
        position = { ...target };
        hero.style.left = `${position.x}%`;
        hero.style.top = `${position.y}%`;
        hero.classList.remove("walking");
        hero.querySelector("img").src = ASSETS.hero.idle;
        destination.classList.remove("visible");
        if (pendingObject) {
          const object = pendingObject;
          pendingObject = null;
          onReach(object);
        } else if (pendingArrival) {
          const onArrival = pendingArrival;
          pendingArrival = null;
          onArrival();
        }
      }
    }
    wasMoving = moving;
    frame = requestAnimationFrame(loop);
  }
  updateCamera();
  frame = requestAnimationFrame(loop);

  return {
    moveToObject(object) {
      if (scripted) return;
      const clearance = Math.max(4.5, (object.size || 8) * .48);
      const side = position.x <= object.x ? -1 : 1;
      const approachX = clamp(object.x + side * clearance, 7, 93);
      const approachY = floorY(object.y);
      const distance = Math.hypot(approachX - position.x, approachY - position.y);
      if (distance <= 1.2) onReach(object);
      else setTarget(approachX, object.y, object);
    },
    moveToExit(exit, onArrival) {
      scripted = true;
      pendingObject = null;
      const exitX = clamp(Number(exit?.x) || 50, 7, 93);
      const exitSceneY = clamp(Number(exit?.y) || GROUND_Y, 0, 100);
      const exitY = floorY(exitSceneY);
      const distance = Math.hypot(exitX - position.x, exitY - position.y);
      if (distance <= .35) {
        position = { x:exitX, y:exitY };
        updateCamera();
        hero.style.left = `${exitX}%`;
        hero.style.top = `${exitY}%`;
        queueMicrotask(onArrival);
      } else setTarget(exitX, exitSceneY, null, onArrival, false);
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(frame);
      if (interactive) {
        stage.removeEventListener("pointerdown", stagePointer);
        stage.removeEventListener("pointermove", mouseFollow);
      }
    }
  };
}
