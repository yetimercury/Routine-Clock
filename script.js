const tasks = [
  {
    name: "Wake Up",
    start: 6 * 60,
    end: 6 * 60 + 15,
    color: "#7BC96F"
  },
  {
    name: "Coffee & Meds",
    start: 6 * 60 + 15,
    end: 6 * 60 + 30,
    color: "#6FA8DC"
  },
  {
    name: "Get Ready",
    start: 6 * 60 + 30,
    end: 7 * 60,
    color: "#F6B26B"
  }
];
function getMinutesNow() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}
function updateClock() {
  const now = new Date();
  const minutes = getMinutesNow();
  const hand = document.getElementById("hand");
  const angle = (now.getMinutes() / 60) * 360;
  hand.setAttribute(
    "transform",
    `rotate(${angle} 200 200)`
  );
  const current = tasks.find(
    task => minutes >= task.start && minutes < task.end
  );
  if (current) {
    document.getElementById("currentTask").innerText =
      current.name;
    const remaining =
      current.end - minutes;
    document.getElementById("nextTask").innerText =
      `${remaining} minutes remaining`;
  } else {
    document.getElementById("currentTask").innerText =
      "No active task";
    document.getElementById("nextTask").innerText = "";
  }
}
setInterval(updateClock, 1000);
updateClock();
