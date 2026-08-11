const img = (name) => `images/${name}`;

export const ASSETS = {
  hero: {
    idle: img("derived/hero-idle-v2.png"),
    walk: [img("derived/hero-walk-1-v2.png"), img("derived/hero-walk-2-v2.png")]
  },
  companion: img("ChatGPT Image 10 авг. 2026 г., 01_35_53.png"),
  core: img("ChatGPT Image 10 авг. 2026 г., 01_32_33.png"),
  sceneFinalCore: img("derived/scene-final-time-core.png"),
  backgrounds: {
    citySquare: img("scenes/city-square-clean-v4.png"),
    metroStation: img("scenes/metro-station-clean-v4.png"),
    shoppingMall: img("scenes/shopping-mall-clean-v4.png"),
    robotFactory: img("scenes/robot-factory-clean-v4.png"),
    controlTower: img("scenes/control-tower-clean-v4.png"),
    timeCoreChamber: img("scenes/time-core-chamber-clean-v4.png")
  },
  objects: {
    timeTerminal: img("ChatGPT Image 10 авг. 2026 г., 01_32_09.png"),
    signalChip: img("ChatGPT Image 10 авг. 2026 г., 01_32_25.png"),
    hologramPedestal: img("ChatGPT Image 10 авг. 2026 г., 01_35_28.png"),
    crystalGarden: img("ChatGPT Image 10 авг. 2026 г., 01_35_45.png"),
    cityMouse: img("ChatGPT Image 10 авг. 2026 г., 01_35_36.png"),
    companionRobot: img("ChatGPT Image 10 авг. 2026 г., 01_35_53.png"),
    ticketMachine: img("ChatGPT Image 10 авг. 2026 г., 02_25_11.png"),
    phone: img("ChatGPT Image 10 авг. 2026 г., 02_25_17.png"),
    maintenancePanel: img("ChatGPT Image 10 авг. 2026 г., 02_25_23.png"),
    stationDisplay: img("ChatGPT Image 10 авг. 2026 г., 02_25_30.png"),
    train: img("ChatGPT Image 10 авг. 2026 г., 02_28_15.png"),
    hangingLight: img("ChatGPT Image 10 авг. 2026 г., 02_28_24.png"),
    metroMouse: img("ChatGPT Image 10 авг. 2026 г., 02_28_31.png"),
    neonStrip: img("ChatGPT Image 10 авг. 2026 г., 02_28_41.png"),
    steam: img("ChatGPT Image 10 авг. 2026 г., 02_28_47.png"),
    mallAdPanel: img("derived/objects/mall-ad-panel.png"),
    shoppingBag: img("derived/objects/shopping-bag.png"),
    directoryScreen: img("derived/objects/directory-screen.png"),
    vendingMachine: img("derived/objects/vending-machine.png"),
    mallTimeCore: img("derived/objects/mall-time-core.png"),
    escalator: img("derived/objects/escalator.png"),
    elevatorIndicator: img("derived/objects/elevator-indicator.png"),
    robotArm: img("derived/objects/robot-arm.png"),
    factoryConsole: img("derived/objects/control-console.png"),
    conveyorBelt: img("derived/objects/conveyor-belt.png"),
    factoryMaintenancePanel: img("derived/objects/factory-maintenance-panel.png"),
    factoryPowerCore: img("derived/objects/factory-power-core.png"),
    partsCrate: img("derived/objects/parts-crate.png"),
    factoryDisplay: img("derived/objects/factory-display.png"),
    camera: img("ChatGPT Image 10 авг. 2026 г., 02_55_47.png"),
    controlConsole: img("ChatGPT Image 10 авг. 2026 г., 02_55_53.png"),
    profileTerminal: img("ChatGPT Image 10 авг. 2026 г., 02_56_00.png"),
    hologramPlatform: img("ChatGPT Image 10 авг. 2026 г., 02_56_06.png")
  }
};

export function preloadAsset(url, logicalName = url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => {
      console.warn(`[TIME GLITCH] Missing asset: ${logicalName} (${url})`);
      resolve(false);
    };
    image.src = url;
  });
}

export function preloadLevel(level, nextLevel) {
  const urls = [level?.background, nextLevel?.background, ASSETS.hero.idle, ...ASSETS.hero.walk].filter(Boolean);
  return Promise.all(urls.map((url, index) => preloadAsset(url, `preload-${index + 1}`)));
}
