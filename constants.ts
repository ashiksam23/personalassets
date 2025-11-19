import { MandalaData } from './types';

export const EMPTY_DATA: MandalaData = {
  mainGoal: "",
  subGoals: Array(9).fill(""),
  tasks: Array(9).fill(null).map(() => Array(9).fill(""))
};

export const OHTANI_DATA: MandalaData = {
  mainGoal: "Draft #1 by 8 Teams",
  subGoals: [
    "Body Building", "Control", "Kire (Sharpness)",
    "Mental", "", "Speed 160km/h",
    "Humanity", "Luck", "Changes"
  ],
  tasks: [
    ["Supplements", "Stamina", "Eat Even If Full", "Flexibility", "", "Nutrition", "Morning Juices", "Training", "Sleep"],
    ["In-step", "Release Point", "Spin Axis", "Stability", "", "Balance", "Stride", "Core", "Lower Body"],
    ["Late Break", "Angle", "Ball Rotation", "Release Front", "", "Imagine Velo", "Wrist Strength", "Finger Strength", "Backspin"],
    ["Clear Head", "Cool", "Focus", "Ambition", "", "Visualize", "Positivity", "Don't Rush", "Passion"],
    Array(9).fill(""), // Center block tasks placeholder (unused)
    ["Shoulder Range", "Mechanics", "Run", "Lower Body", "", "Core Power", "Plyometrics", "Flexibility", "Snap"],
    ["Polite", "Grateful", "Sensibility", "Loved by all", "", "Trust", "Generous", "Helpful", "Greetings"],
    ["Pick up trash", "Use equipment well", "Respect Referees", "Greeting", "", "Clean Room", "Positive", "Books", "Support Teammates"],
    ["Forkball", "Curve", "Slider", "Changeup", "", "Cutter", "Sinker", "Splitter", "Analysis"],
  ]
};