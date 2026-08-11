import { ASSETS } from "../assets.js?v=clean-scenes-v4";

const mcq = (id, objectId, title, prompt, options, answer, signalWord, hint, extra = {}) => ({
  id,
  objectId,
  type: "mcq",
  title,
  instruction: "Choose the correct answer.",
  prompt,
  options,
  answer,
  signalWord,
  hint,
  ...extra
});

const sceneObject = (id, label, x, y, image, taskId, size, motion = "float", depth = 3, extra = {}) => ({
  id,
  label,
  x,
  y,
  image,
  taskId,
  size,
  motion,
  depth,
  ...extra
});

export const LEVELS = [
  {
    id: 1,
    title: "CITY SQUARE",
    subtitle: "Signal Scan",
    background: ASSETS.backgrounds.citySquare,
    coreReward: true,
    ambience: "crystal",
    exit: { x:93, y:76 },
    objects: [
      sceneObject("time-terminal", "Time terminal", 18, 34, ASSETS.objects.timeTerminal, "L1-T1", 18, "hum", 4, { mount:"floor" }),
      sceneObject("signal-chip", "Signal chip", 35, 47, ASSETS.objects.signalChip, "L1-T2", 9, "float", 3, { mount:"floating" }),
      sceneObject("hologram-pedestal", "Hologram pedestal", 20, 67, ASSETS.objects.hologramPedestal, "L1-T3", 10, "pulse", 3, { mount:"floor", labelPosition:"top" }),
      sceneObject("crystal-garden", "Quick scanner", 78, 34, ASSETS.objects.crystalGarden, "L1-T4", 10, "pulse", 4, { mount:"floor" }),
      sceneObject("time-core", "Time core", 89, 68, ASSETS.core, "L1-T5", 12, "float", 4, { mount:"floating", labelPosition:"top" }),
      sceneObject("city-mouse", "Chrono mouse", 75, 68, ASSETS.objects.cityMouse, "L1-T6", 9, "scurry", 5, { mount:"floor" }),
      sceneObject("companion-robot", "Helper bot", 52, 66, ASSETS.objects.companionRobot, "L1-T7", 8, "float", 3, { mount:"floating" })
    ],
    tasks: [
      {
        id: "L1-T1",
        objectId: "time-terminal",
        type: "tap-sort",
        title: "SIGNAL SORT",
        instruction: "Sort the time signals.",
        groups: ["ROUTINE", "LIVE"],
        items: [
          ["always", "ROUTINE"], ["now", "LIVE"], ["usually", "ROUTINE"], ["right now", "LIVE"],
          ["often", "ROUTINE"], ["at the moment", "LIVE"], ["every day", "ROUTINE"], ["never", "ROUTINE"]
        ],
        hint: "Routine = something that happens again and again. Live = something happening now."
      },
      mcq("L1-T2", "signal-chip", "ROUTINE SENTENCE", "Lena ___ her homework every day.", ["does", "is doing"], "does", "every day", "“Every day” tells us this is a routine."),
      mcq("L1-T3", "hologram-pedestal", "LIVE SENTENCE", "Look! The drone ___ over the square.", ["flies", "is flying"], "is flying", "Look!", "For RIGHT NOW, use am / is / are + verb-ing."),
      {
        id: "L1-T4",
        objectId: "crystal-garden",
        type: "rapid-sort",
        title: "QUICK SCAN",
        instruction: "Classify each signal.",
        groups: ["PRESENT SIMPLE", "PRESENT CONTINUOUS"],
        items: [
          ["on Mondays", "PRESENT SIMPLE"], ["Listen!", "PRESENT CONTINUOUS"],
          ["sometimes", "PRESENT SIMPLE"], ["right now", "PRESENT CONTINUOUS"]
        ],
        hint: "Look for routine signals and live signals."
      },
      mcq("L1-T5", "time-core", "DAILY ROUTE", "Maya usually ___ the bus to school.", ["takes", "is taking", "take"], "takes", "usually", "“Usually” describes a routine, so use Present Simple."),
      mcq("L1-T6", "city-mouse", "LISTEN CLOSELY", "Listen! The children ___ near the fountain.", ["laugh", "are laughing", "laughs"], "are laughing", "Listen!", "“Listen!” points to an action happening now."),
      mcq("L1-T7", "companion-robot", "LIVE NEGATIVE", "I ___ TV at the moment.", ["don't watch", "am not watching", "doesn't watch"], "am not watching", "at the moment", "Use am not + verb-ing for a negative action happening now.")
    ]
  },
  {
    id: 2,
    title: "METRO STATION",
    subtitle: "Choose the Correct Form",
    background: ASSETS.backgrounds.metroStation,
    coreReward: true,
    ambience: "metro",
    exit: { x:82, y:60 },
    objects: [
      sceneObject("ticket-machine", "Ticket machine", 9, 43, ASSETS.objects.ticketMachine, "L2-T1", 13, "hum", 4, { mount:"floor" }),
      sceneObject("phone", "Time phone", 30, 34, ASSETS.objects.phone, "L2-T2", 16, "float", 3, { mount:"wall" }),
      sceneObject("maintenance-panel", "Maintenance panel", 57, 52, ASSETS.objects.maintenancePanel, "L2-T3", 8, "pulse", 3, { mount:"floor" }),
      sceneObject("station-display", "Station display", 30, 61, ASSETS.objects.stationDisplay, "L2-T4", 8, "hum", 3, { mount:"wall" }),
      sceneObject("metro-train", "Time train", 69, 20, ASSETS.objects.train, "L2-T5", 18, "glide", 2, { mount:"track", ratio:"2.2" }),
      sceneObject("hanging-light", "Signal light", 70, 75, ASSETS.objects.hangingLight, "L2-T6", 13, "sway", 2, { mount:"ceiling" }),
      sceneObject("metro-mouse", "Metro mouse", 90, 45, ASSETS.objects.metroMouse, "L2-T7", 12, "scurry", 5, { mount:"floor" })
    ],
    tasks: [
      mcq("L2-T1", "ticket-machine", "TICKET MACHINE", "The train usually ___ at 8 o'clock.", ["arrives", "is arriving"], "arrives", "usually", "“Usually” tells us this is a routine."),
      mcq("L2-T2", "phone", "PLATFORM", "We ___ for the train right now.", ["wait", "are waiting"], "are waiting", "right now", "For RIGHT NOW, use am / is / are + verb-ing."),
      mcq("L2-T3", "maintenance-panel", "NEGATIVE", "Tom travels by metro every day.", ["Tom doesn't travel by metro every day.", "Tom isn't travelling by metro every day."], "Tom doesn't travel by metro every day.", "every day", "After “doesn't”, use the base verb.", { instruction:"Choose the correct negative sentence." }),
      mcq("L2-T4", "station-display", "QUESTION", "Mia is waiting on the platform now.", ["Does Mia wait on the platform now?", "Is Mia waiting on the platform now?"], "Is Mia waiting on the platform now?", "now", "For an action happening now, ask: Is + subject + verb-ing?", { instruction:"Choose the correct question." }),
      mcq("L2-T5", "metro-train", "MORNING ROUTE", "My dad often ___ to work by train.", ["goes", "is going", "go"], "goes", "often", "“Often” shows a repeated action; with “my dad”, add -s."),
      mcq("L2-T6", "hanging-light", "DEPARTURE ALERT", "Look! The train ___ the station.", ["leaves", "is leaving", "leave"], "is leaving", "Look!", "Use is + verb-ing for an action you can see happening now."),
      {
        id: "L2-T7",
        objectId: "metro-mouse",
        type: "word-order",
        title: "ROUTE QUESTION",
        instruction: "Put the words in the correct order to make a question.",
        chips: ["does", "the metro", "run", "every day"],
        answer: ["does", "the metro", "run", "every day"],
        hint: "For a Present Simple question, use Does + subject + base verb."
      }
    ]
  },
  {
    id: 3,
    title: "SHOPPING MALL",
    subtitle: "Build the Sentence",
    background: ASSETS.backgrounds.shoppingMall,
    coreReward: true,
    ambience: "mall",
    exit: { x:61, y:55 },
    objects: [
      sceneObject("mall-ad-panel", "Mall ad panel", 10, 43, ASSETS.objects.mallAdPanel, "L3-T1", 14, "hum", 3, { mount:"floor", clip:"inset(2% 0 0 0)" }),
      sceneObject("shopping-bag", "Shopping bag", 31, 47, ASSETS.objects.shoppingBag, "L3-T2", 15, "float", 4, { mount:"floor" }),
      sceneObject("directory-screen", "Directory", 38, 70, ASSETS.objects.directoryScreen, "L3-T3", 11, "pulse", 3, { mount:"floor" }),
      sceneObject("vending-machine", "Vending machine", 78, 35, ASSETS.objects.vendingMachine, "L3-T4", 18, "hum", 4, { mount:"floor" }),
      sceneObject("mall-time-core", "Mall time core", 82, 73, ASSETS.objects.mallTimeCore, "L3-T5", 14, "float", 3, { mount:"floor", labelPosition:"top" }),
      sceneObject("escalator", "Time escalator", 95, 50, null, "L3-T6", 8, "pulse", 3, { mount:"wall", ratio:"0.58", embedded:true }),
      sceneObject("elevator-indicator", "Lift indicator", 56, 70, ASSETS.objects.elevatorIndicator, "L3-T7", 10, "pulse", 3, { mount:"wall", ratio:"0.72" })
    ],
    tasks: [
      {
        id: "L3-T1",
        objectId: "mall-ad-panel",
        type: "word-order",
        title: "PRESENT SIMPLE",
        instruction: "Put the words in the correct order to make a sentence.",
        chips: ["she", "usually", "buys", "fruit", "at this shop"],
        answer: ["she", "usually", "buys", "fruit", "at this shop"],
        hint: "In Present Simple, put “usually” before the main verb."
      },
      {
        id: "L3-T2",
        objectId: "shopping-bag",
        type: "word-order",
        title: "PRESENT CONTINUOUS",
        instruction: "Put the words in the correct order to make a sentence.",
        chips: ["they", "are", "looking", "at", "the map", "right now"],
        answer: ["they", "are", "looking", "at", "the map", "right now"],
        hint: "For RIGHT NOW, use are + verb-ing."
      },
      mcq("L3-T3", "directory-screen", "NEGATIVE FORM", "Ben wears a jacket every day.", ["Ben doesn't wear a jacket every day.", "Ben isn't wearing a jacket every day.", "Ben don't wear a jacket every day."], "Ben doesn't wear a jacket every day.", "every day", "After “doesn't”, use the base verb.", { instruction:"Choose the correct negative sentence." }),
      mcq("L3-T4", "vending-machine", "QUESTION FORM", "The children are choosing a drink at the moment.", ["Do the children choose a drink at the moment?", "Are the children choosing a drink at the moment?"], "Are the children choosing a drink at the moment?", "at the moment", "Use Are + subject + verb-ing for an action happening now.", { instruction:"Choose the correct question." }),
      {
        id: "L3-T5",
        objectId: "mall-time-core",
        type: "word-order",
        title: "SHOPPING ROUTINE",
        instruction: "Put the words in the correct order to make a question.",
        chips: ["does", "he", "usually", "have", "lunch", "here"],
        answer: ["does", "he", "usually", "have", "lunch", "here"],
        hint: "After “does”, use the base verb: have."
      },
      mcq("L3-T6", "escalator", "CLOSED SHOP", "Sara ___ at the moment.", ["doesn't shop", "isn't shopping", "don't shop"], "isn't shopping", "at the moment", "Use isn't + verb-ing for a negative action happening now."),
      {
        id: "L3-T7",
        objectId: "elevator-indicator",
        type: "rapid-sort",
        title: "MALL SIGNAL SCAN",
        instruction: "Classify every sentence.",
        groups: ["PRESENT SIMPLE", "PRESENT CONTINUOUS"],
        items: [
          ["The shop opens every day.", "PRESENT SIMPLE"],
          ["Look! Mum is carrying two bags.", "PRESENT CONTINUOUS"],
          ["We often meet here.", "PRESENT SIMPLE"],
          ["The lift is going up now.", "PRESENT CONTINUOUS"]
        ],
        hint: "Find the routine or live signal in each sentence."
      }
    ]
  },
  {
    id: 4,
    title: "ROBOT FACTORY",
    subtitle: "Repair the Grammar System",
    background: ASSETS.backgrounds.robotFactory,
    coreReward: true,
    ambience: "factory",
    exit: { x:93, y:54 },
    objects: [
      sceneObject("robot-control-terminal", "Control terminal", 15, 43, ASSETS.objects.factoryConsole, "L4-T1", 15, "hum", 4, { mount:"floor" }),
      sceneObject("assembly-robot-arm", "Robot arm", 30, 26, ASSETS.objects.robotArm, "L4-T2", 15, "sway", 3, { mount:"floor" }),
      sceneObject("parts-crate", "Parts crate", 28, 72, ASSETS.objects.partsCrate, "L4-T3", 14, "hum", 5, { mount:"floor" }),
      sceneObject("factory-panel", "Factory panel", 67, 26, ASSETS.objects.factoryMaintenancePanel, "L4-T4", 18, "pulse", 3, { mount:"wall", clip:"inset(0 0 8% 0)" }),
      sceneObject("factory-power-core", "Power core", 84, 51, ASSETS.objects.factoryPowerCore, "L4-T5", 16, "pulse", 3, { mount:"floor", clip:"inset(0 0 6% 0)" }),
      sceneObject("conveyor-belt", "Conveyor belt", 89, 74, null, "L4-T6", 13, "pulse", 4, { mount:"track", ratio:"2.8", embedded:true }),
      sceneObject("factory-display", "System display", 58, 76, ASSETS.objects.factoryDisplay, "L4-T7", 13, "hum", 3, { mount:"wall" })
    ],
    tasks: [
      mcq("L4-T1", "robot-control-terminal", "FIX THE LIVE SENTENCE", "The robot is check the box now.", ["The robot checks the box now.", "The robot is checking the box now.", "The robot checking the box now."], "The robot is checking the box now.", "now", "Present Continuous needs is + verb-ing."),
      mcq("L4-T2", "assembly-robot-arm", "FIX THE ROUTINE SENTENCE", "This machine usually is making small parts.", ["This machine usually makes small parts.", "This machine is usually making small parts.", "This machine usually make small parts."], "This machine usually makes small parts.", "usually", "“Usually” signals a routine; with “this machine”, add -s."),
      mcq("L4-T3", "parts-crate", "CHOOSE THE ROUTINE FORM", "The engineers ___ the system every morning.", ["check", "are checking", "checks"], "check", "every morning", "The plural subject “engineers” uses the base verb."),
      mcq("L4-T4", "factory-panel", "CHOOSE THE LIVE FORM", "Listen! The robot ___ a warning sound.", ["makes", "is making", "make"], "is making", "Listen!", "Listen! tells us the action is happening now."),
      mcq("L4-T5", "factory-power-core", "REPAIR THE NEGATIVE", "The robot doesn't checks the labels.", ["The robot doesn't check the labels.", "The robot isn't check the labels.", "The robot don't checks the labels."], "The robot doesn't check the labels.", null, "After doesn't, use the base verb without -s."),
      mcq("L4-T6", "conveyor-belt", "REPAIR THE QUESTION", "Is the engineers working now?", ["Are the engineers working now?", "Do the engineers working now?", "Is the engineers work now?"], "Are the engineers working now?", "now", "With a plural subject, use Are + verb-ing."),
      mcq("L4-T7", "factory-display", "BELT ROUTINE", "This belt ___ boxes every day.", ["moves", "is moving", "move"], "moves", "every day", "A routine with “this belt” needs the verb ending -s.")
    ]
  },
  {
    id: 5,
    title: "CONTROL TOWER",
    subtitle: "Routine or Right Now?",
    background: ASSETS.backgrounds.controlTower,
    coreReward: true,
    ambience: "tower",
    exit: { x:93, y:72 },
    objects: [
      sceneObject("surveillance-camera", "Surveillance feed", 14, 23, ASSETS.objects.camera, "L5-T1", 16, "sway", 3, { mount:"ceiling" }),
      sceneObject("control-console", "Control console", 34, 25, null, "L5-T2", 14, "pulse", 4, { mount:"floor", ratio:"2.8", embedded:true }),
      sceneObject("profile-terminal", "Agent profile", 58, 48, ASSETS.objects.profileTerminal, "L5-T3", 16, "pulse", 4, { mount:"floor" }),
      sceneObject("hologram-platform", "Mixed scanner", 84, 37, ASSETS.objects.hologramPlatform, "L5-T4", 18, "pulse", 4, { mount:"floor" }),
      sceneObject("tower-display", "Mission display", 89, 13, null, "L5-T5", 8, "pulse", 3, { mount:"wall", ratio:"2.4", embedded:true, labelPosition:"top" }),
      sceneObject("tower-signal-chip", "Signal decoder", 82, 73, ASSETS.objects.signalChip, "L5-T6", 14, "float", 3, { mount:"floating" }),
      sceneObject("tower-helper", "Tower helper", 14, 78, ASSETS.objects.companionRobot, "L5-T7", 16, "float", 4, { mount:"floating" })
    ],
    tasks: [
      {
        id: "L5-T1",
        objectId: "surveillance-camera",
        type: "multi-select",
        title: "SURVEILLANCE FEED",
        instruction: "Select the correct ROUTINE and LIVE pair.",
        prompt: "Mia's timeline",
        answers: ["Mia usually walks to school.", "She is riding a scooter right now."],
        options: ["Mia usually walks to school.", "She rides a scooter right now.", "Mia is usually walking to school.", "She is riding a scooter right now."],
        hint: "One sentence is her routine; the other is happening right now."
      },
      mcq("L5-T2", "control-console", "SIGNAL WORD", "Leo ___ football after school.\nChoose the best routine signal.", ["usually", "right now", "at the moment"], "usually", null, "A repeated after-school activity needs a routine signal.", { completionText: "Leo usually plays football after school." }),
      {
        id: "L5-T3",
        objectId: "profile-terminal",
        type: "multi-select",
        title: "AGENT PROFILE",
        instruction: "Select both correct sentences.",
        prompt: "Emma: routine and live report",
        answers: ["Emma often drinks tea in the morning.", "She is drinking juice at the moment."],
        options: ["Emma often drinks tea in the morning.", "Emma often is drinking tea in the morning.", "She drinks juice at the moment.", "She is drinking juice at the moment."],
        hint: "“Often” is routine; “at the moment” is live."
      },
      {
        id: "L5-T4",
        objectId: "hologram-platform",
        type: "rapid-sort",
        title: "RAPID MIXED SCAN",
        instruction: "Classify every sentence.",
        groups: ["PRESENT SIMPLE", "PRESENT CONTINUOUS"],
        items: [
          ["Dad is cooking right now.", "PRESENT CONTINUOUS"],
          ["We usually play games on Friday.", "PRESENT SIMPLE"],
          ["Listen! The baby is crying.", "PRESENT CONTINUOUS"],
          ["Anna sometimes reads before bed.", "PRESENT SIMPLE"],
          ["They are running at the moment.", "PRESENT CONTINUOUS"],
          ["Sam never drinks coffee.", "PRESENT SIMPLE"]
        ],
        hint: "Find the signal word in each sentence first."
      },
      {
        id: "L5-T5",
        objectId: "tower-display",
        type: "word-order",
        title: "TWO TIME SIGNALS",
        instruction: "Put the words in the correct order to make two contrasting clauses.",
        chips: ["Leo", "usually", "drives", "but", "he", "is", "walking", "right now"],
        answer: ["Leo", "usually", "drives", "but", "he", "is", "walking", "right now"],
        hint: "Use Present Simple before “but”. Put “right now” at the end of the Present Continuous clause."
      },
      mcq("L5-T6", "tower-signal-chip", "LIVE NEGATIVE", "The agent ___ the console at the moment.", ["doesn't use", "isn't using", "don't use"], "isn't using", "at the moment", "At the moment needs is not + verb-ing."),
      {
        id: "L5-T7",
        objectId: "tower-helper",
        type: "rapid-sort",
        title: "FINAL TOWER SCAN",
        instruction: "Classify every report.",
        groups: ["PRESENT SIMPLE", "PRESENT CONTINUOUS"],
        items: [
          ["The tower sends a report every hour.", "PRESENT SIMPLE"],
          ["A drone is landing right now.", "PRESENT CONTINUOUS"],
          ["Mia often checks the cameras.", "PRESENT SIMPLE"],
          ["Listen! The alarm is ringing.", "PRESENT CONTINUOUS"]
        ],
        hint: "Routine reports use Present Simple; live reports use Present Continuous."
      }
    ]
  },
  {
    id: 6,
    title: "VOICE LAB",
    subtitle: "Speaking Mission",
    background: ASSETS.backgrounds.timeCoreChamber,
    coreReward: false,
    ambience: "chamber",
    exit: { x:51, y:57 },
    objects: [],
    tasks: [],
    speakingObjects: [
      { id:"voice-console-left", label:"Voice console", x:8, y:38, size:12, image:ASSETS.objects.controlConsole, mount:"floor", motion:"hum", depth:4 },
      { id:"voice-display-left", label:"Voice display", x:28, y:39, size:11, image:ASSETS.objects.stationDisplay, mount:"wall", motion:"pulse", depth:3 },
      { id:"voice-core", label:"Time Core", x:71, y:35, size:11, image:ASSETS.core, mount:"floating", motion:"pulse", depth:3 },
      { id:"voice-platform", label:"Core platform", x:86, y:42, size:13, image:ASSETS.objects.hologramPlatform, mount:"floor", motion:"pulse", depth:4 },
      { id:"voice-terminal", label:"Voice terminal", x:17, y:68, size:16, image:ASSETS.objects.profileTerminal, mount:"wall", motion:"hum", depth:3 },
      { id:"voice-console-right", label:"Audio console", x:78, y:68, size:13, image:ASSETS.objects.factoryConsole, mount:"floor", motion:"hum", depth:4 },
      { id:"voice-signal", label:"Voice signal", x:51, y:59, size:13, image:ASSETS.objects.signalChip, mount:"floating", motion:"float", depth:3 }
    ],
    speakingPrompts: [
      { title: "AFTER-SCHOOL REPORT", prompt: "Say what you usually do after school and what you are doing right now.", model: "I usually play basketball after school. Right now, I am speaking English." },
      { title: "MORNING REPORT", prompt: "Say what you usually do before school and what is happening around you now.", model: "I usually eat breakfast before school. My classmates are listening now." },
      { title: "FAMILY REPORT", prompt: "Describe one family routine and say what one person in your family is doing now.", model: "My dad usually cooks dinner. Right now, he is working." },
      { title: "TRAVEL REPORT", prompt: "Say how you usually travel somewhere and how you are moving or sitting now.", model: "I usually go to school by bus. Right now, I am sitting in the classroom." },
      { title: "FOOD REPORT", prompt: "Say what you usually eat or drink and what you are eating or drinking now.", model: "I usually drink tea in the morning. Right now, I am drinking water." },
      { title: "WEEKEND REPORT", prompt: "Describe your usual weekend and one action you are doing now.", model: "I usually visit my friends at the weekend. Right now, I am answering a question." },
      { title: "TIME-CORE REPORT", prompt: "Invent one thing the Time Core does every day and one thing it is doing right now.", model: "The Time Core protects the city every day. Right now, it is shining brightly." }
    ]
  }
];

export const getLevel = (id) => LEVELS.find((level) => level.id === id);
export const getTask = (id) => LEVELS.flatMap((level) => level.tasks).find((task) => task.id === id);
