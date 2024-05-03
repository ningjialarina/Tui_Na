console.log("acupoints.js loading...");

export const acupoints = [
  {
    "name": "商阳",
    "pinyin": "Shāngyáng (LI1)",
    "symptoms": [
      "headache",
      "migraine",
      "tension headache",
      "cluster headache",
      "forehead pain",
      "sinus pain",
    ],
    "x": 762,
    "y": 50,
  },
  {
    "name": "二间",
    "pinyin": "Èrjiān (LI2)",
    "symptoms": [
      "toothache",
      "jaw pain",
      "dental pain",
      "gum pain",
      "wisdom tooth pain",
      "molar pain",
    ],
    "x": 680,
    "y": 160,
  },
  {
    "name": "三间",
    "pinyin": "Sānjiān (LI3)",
    "symptoms": [
      "lower back pain",
      "lumbar pain",
      "sciatica",
      "lumbar sprain",
      "back stiffness",
      "kidney pain",
    ],
    "x": 675,
    "y": 226,
  },
  {
    "name": "合谷",
    "pinyin": "Hégǔ (LI4)",
    "symptoms": [
      "headache",
      "toothache",
      "neck pain",
      "sinus headache",
      "stress headache",
      "eye strain",
    ],
    "x": 698,
    "y": 275,
  },
  {
    "name": "阳溪",
    "pinyin": "Yángxī (LI5)",
    "symptoms": [
      "wrist pain",
      "carpal tunnel syndrome",
      "hand stiffness",
      "thumb pain",
      "hand arthritis",
      "sprained wrist",
    ],
    "x": 654,
    "y": 349,
  },
  {
    "name": "偏历",
    "pinyin": "Piānlì (LI6)",
    "symptoms": [
      "wrist sprain",
      "arm pain",
      "acute elbow pain",
      "chronic elbow pain",
      "arm fatigue",
      "numbness in arm",
    ],
    "x": 609,
    "y": 453,
  },
  {
    "name": "温溜",
    "pinyin": "Wēnliū (LI7)",
    "symptoms": [
      "elbow pain",
      "tendonitis",
      "forearm pain",
      "golfer's elbow",
      "tennis elbow",
      "arm cramps",
    ],
    "x": 560,
    "y": 555,
  },
  {
    "name": "下廉",
    "pinyin": "Xiàlián (LI8)",
    "symptoms": [
      "forearm pain",
      "muscle strain",
      "arm fatigue",
      "bruised forearm",
      "shooting pain in arm",
      "repetitive strain injury",
    ],
    "x": 502,
    "y": 657,
  },
  {
    "name": "上廉",
    "pinyin": "Shànglián (LI9)",
    "symptoms": [
      "upper arm pain",
      "shoulder pain",
      "bicep pain",
      "arm swelling",
      "bicep strain",
      "shoulder stiffness",
    ],
    "x": 474,
    "y": 712,
  },
  {
    "name": "手三里",
    "pinyin": "Shǒu Sān Lǐ (LI10)",
    "symptoms": [
      "shoulder pain",
      "arm tension",
      "rotator cuff injury",
      "shoulder bursitis",
      "arm soreness",
      "shoulder tendinitis",
    ],
    "x": 443,
    "y": 787,
  },
  {
    "name": "曲池",
    "pinyin": "Qū Chí (LI11)",
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

  const canvas = document.getElementById("acupointCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#F93921";
  ctx.font = "32px Arial"; // 设置字体大小和类型
  ctx.textAlign = "left"; // 设置文本对齐方式
  ctx.textBaseline = "middle"; // 设置文本的基线

  if (params.has("name")) {
    const names = params.getAll("name").map((name) => decodeURIComponent(name));
    console.log("Drawing specific points:", names.join(", ")); // 确认要绘制的穴位名称
    names.forEach((name) => {
      const point = acupoints.find((p) => p.name === name);
      if (point) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(`${point.name} (${point.pinyin})`, point.x + 10, point.y); // 绘制穴位名称
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
      ctx.fillText(`${point.name} (${point.pinyin})`, point.x + 10, point.y); // 绘制穴位名称
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
