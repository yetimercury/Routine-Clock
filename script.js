const tasks = [
  {
    name: "Wake up kids",
    start: 6 * 60,
    end: 6 * 60 + 10,
    color: "#7BC96F"
  },
  {
    name: "Play with dogs",
    start: 6 * 60 + 10,
    end: 6 * 60 + 25,
    color: "#6FA8DC"
  },
  {
    name: "Get kids dressed",
    start: 6 * 60 + 25,
    end: 6 * 60 + 35,
    color: "#F6B26B"
  }
];

const cx = 200;
const cy = 200;
const r = 160;

function getMinutesNow() {

  // DEMO MODE
  // Pretend current time is 6:18 AM

  return (6 * 60) + 18;

}

function polarToCartesian(angle, radius) {
  const radians = (angle - 90) * Math.PI / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians)
  };
}

function describeArc(startAngle, endAngle, radius) {
  const start = polarToCartesian(endAngle, radius);
  const end = polarToCartesian(startAngle, radius);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z"
  ].join(" ");
}

function minutesToAngle(minutes, routineStart, routineEnd) {
  return ((minutes - routineStart) / (routineEnd - routineStart)) * 360;
}

function updateClock() {
  const minutes = getMinutesNow();
  const routineStart = 6 * 60;
  const routineEnd = 7 * 60;

  const wedges = document.getElementById("wedges");
  wedges.innerHTML = "";

  tasks.forEach(task => {
    let startAngle = minutesToAngle(task.start, routineStart, routineEnd);
    let endAngle = minutesToAngle(task.end, routineStart, routineEnd);

    let fill = task.color;
    let opacity = 0.35;

    if (minutes >= task.end) {
      fill = "#bbbbbb";
      opacity = 0.25;
    }

    if (minutes >= task.start && minutes < task.end) {
      startAngle = minutesToAngle(minutes, routineStart, routineEnd);
      opacity = 1;
    }

    if (true) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", describeArc(startAngle, endAngle, r));
      path.setAttribute("fill", fill);
      path.setAttribute("opacity", opacity);
      wedges.appendChild(path);
    }
  });

  const now = new Date();
  const hand = document.getElementById("hand");
  const handAngle = (now.getMinutes() / 60) * 360;
  hand.setAttribute("transform", `rotate(${handAngle} 200 200)`);

  const current = tasks.find(task => minutes >= task.start && minutes < task.end);

  if (current) {
    const remaining = Math.ceil(current.end - minutes);
    document.getElementById("currentTask").innerText = current.name;
    document.getElementById("nextTask").innerText = `${remaining} minutes remaining`;
  } else {
    document.getElementById("currentTask").innerText = "No active task";
    document.getElementById("nextTask").innerText = "";
  }
}

setInterval(updateClock, 1000);
updateClock();
