const DEMO_MODE = true;
const DEMO_MINUTES = (6 * 60) + 20;

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

function getRoutineMinutesNow() {
  if (DEMO_MODE) {
    return DEMO_MINUTES;
  }

  const now = new Date();
  return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
}

function getRealTimeLabel() {
  const now = new Date();

  return now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
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

function drawNumbers() {
  const numbers = document.getElementById("numbers");
  numbers.innerHTML = "";

  for (let i = 1; i <= 12; i++) {
    const angle = i * 30;
    const point = polarToCartesian(angle, 135);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", point.x);
    text.setAttribute("y", point.y + 7);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "24");
    text.setAttribute("font-weight", "bold");
    text.setAttribute("fill", "#222");
    text.textContent = i;

    numbers.appendChild(text);
  }
}

function updateClock() {
  const minutes = getRoutineMinutesNow();
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

    let isActive = false;

    if (minutes >= task.start && minutes < task.end) {
      startAngle = minutesToAngle(minutes, routineStart, routineEnd);
      opacity = 1;
      isActive = true;
    }

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", describeArc(startAngle, endAngle, r));
    path.setAttribute("fill", fill);
    path.setAttribute("opacity", opacity);
    if (isActive) {
      path.setAttribute("stroke", "#222");
      path.setAttribute("stroke-width", "4");
      path.setAttribute("filter", "url(#activeGlow)");
    }
    wedges.appendChild(path);
  });

    const hourHand = document.getElementById("hourHand");
    hourHand.setAttribute("transform", `rotate(180 200 200)`);

    const hand = document.getElementById("hand");
    const handAngle = minutesToAngle(minutes, routineStart, routineEnd);
    hand.setAttribute("transform", `rotate(${handAngle} 200 200)`);

  const current = tasks.find(task => minutes >= task.start && minutes < task.end);

  if (current) {
    const remaining = Math.ceil(current.end - minutes);
    document.getElementById("currentTask").innerText =
      `${current.name}`;

    document.getElementById("nextTask").innerText =
      `${remaining} minutes remaining · Real time: ${getRealTimeLabel()} · Demo time: 6:18 AM`;
  } else {
    document.getElementById("currentTask").innerText =
      "No active task";

    document.getElementById("nextTask").innerText =
      `Real time: ${getRealTimeLabel()}`;
  }
}

drawNumbers();
setInterval(updateClock, 1000);
updateClock();
