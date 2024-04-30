console.log("acupoints.js loading...");

export const acupoints = [
  {
    "name": "商阳（LI1）",
    "symptoms": [
      "headache",
      "migraine",
      "tension headache",
      "cluster headache",
      "forehead pain",
      "sinus pain",
    ],
    "x": 725,
    "y": 77,
  },
  {
    "name": "二间（LI2）",
    "symptoms": [
      "toothache",
      "jaw pain",
      "dental pain",
      "gum pain",
      "wisdom tooth pain",
      "molar pain",
    ],
    "x": 688,
    "y": 210,
  },
  {
    "name": "三间（LI3）",
    "symptoms": [
      "lower back pain",
      "lumbar pain",
      "sciatica",
      "lumbar sprain",
      "back stiffness",
      "kidney pain",
    ],
    "x": 683,
    "y": 262,
  },
  {
    "name": "合谷（LI4）",
    "symptoms": [
      "headache",
      "toothache",
      "neck pain",
      "sinus headache",
      "stress headache",
      "eye strain",
    ],
    "x": 706,
    "y": 303,
  },
  {
    "name": "阳溪（LI5）",
    "symptoms": [
      "wrist pain",
      "carpal tunnel syndrome",
      "hand stiffness",
      "thumb pain",
      "hand arthritis",
      "sprained wrist",
    ],
    "x": 684,
    "y": 399,
  },
  {
    "name": "偏历（LI6）",
    "symptoms": [
      "wrist sprain",
      "arm pain",
      "acute elbow pain",
      "chronic elbow pain",
      "arm fatigue",
      "numbness in arm",
    ],
    "x": 639,
    "y": 473,
  },
  {
    "name": "温溜（LI7）",
    "symptoms": [
      "elbow pain",
      "tendonitis",
      "forearm pain",
      "golfer's elbow",
      "tennis elbow",
      "arm cramps",
    ],
    "x": 600,
    "y": 535,
  },
  {
    "name": "下廉（LI8）",
    "symptoms": [
      "forearm pain",
      "muscle strain",
      "arm fatigue",
      "bruised forearm",
      "shooting pain in arm",
      "repetitive strain injury",
    ],
    "x": 522,
    "y": 647,
  },
  {
    "name": "上廉（LI9）",
    "symptoms": [
      "upper arm pain",
      "shoulder pain",
      "bicep pain",
      "arm swelling",
      "bicep strain",
      "shoulder stiffness",
    ],
    "x": 484,
    "y": 712,
  },
  {
    "name": "手三里（LI10）",
    "symptoms": [
      "shoulder pain",
      "arm tension",
      "rotator cuff injury",
      "shoulder bursitis",
      "arm soreness",
      "shoulder tendinitis",
    ],
    "x": 453,
    "y": 757,
  },
  {
    "name": "曲池（LI11）",
    "symptoms": [
      "shoulder pain",
      "frozen shoulder",
      "elbow stiffness",
      "elbow bursitis",
      "upper arm pain",
      "joint pain",
    ],
    "x": 412,
    "y": 884,
  },
];

/**
 * 根据症状筛选穴位
 * @param {string} symptom - 症状描述
 * @returns {Array} 匹配症状的穴位数组
 */
export function findAcupointsBySymptom(symptom) {
  return acupoints.filter((point) =>
    point.symptoms.some((s) => s.toLowerCase().includes(symptom.toLowerCase()))
  );
}

// 修改后的 drawPoints 函数，支持从 URL 中获取穴位名
function drawPoints() {
  const params = new URLSearchParams(window.location.search);
  console.log("URL Parameters:", params.toString()); // 打印出所有 URL 参数
  //const params = new URLSearchParams(window.location.search);
  console.log("URL Parameters:", params.toString()); // 输出所有参数查看

  const canvas = document.getElementById("acupointCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";

  if (params.has("name")) {
    const names = params.getAll("name");
    console.log("Drawing specific points:", names.join(", ")); // 确认要绘制的穴位名称
    names.forEach((name) => {
      const point = acupoints.find((p) => p.name === name);
      if (point) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        displayPointDetails(point);
      } else {
        console.log("No point matched the name provided."); // 如果没有找到对应穴位
      }
    });
  } else {
    console.log("Drawing all points"); // 如果没有提供特定穴位名称
    acupoints.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
}

// 显示选定穴位的详细信息
function displayPointDetails(point) {
  const container = document.getElementById("acupointRecommendations");
  container.innerHTML = `<h2>${point.name}</h2><p>Symptoms: ${
    point.symptoms.join(", ")
  }</p>`;
}

// 导出更新后的 drawPoints 函数
export { drawPoints };

console.log("acupoints.js loaded successfully.");
