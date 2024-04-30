import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { gptPrompt } from "../shared/openai.ts";
import { createExitSignal, staticServer } from "../shared/server.ts";
import { acupoints } from "./public/acupoints.js";
console.log("Acupoints loaded:", acupoints.length);
import { Chalk } from "npm:chalk@5";
console.log("Testing console output");
const chalk = new Chalk({ level: 1 });

// change working directory to the current file's directory
//Deno.chdir(new URL(".", import.meta.url).pathname);

// log the current working directory with friendly message
console.log(`Current working directory: ${Deno.cwd()}`);

const app = new Application();
const router = new Router();

// 对话状态管理
const sessions = new Map();

//searching points
function findAcupointsBySymptom(symptom) {
  console.log("Searching for acupoints with symptom:", symptom);
  const filteredPoints = acupoints.filter((point) =>
    point.symptoms.includes(symptom.toLowerCase())
  );
  console.log("Found acupoints:", filteredPoints.map((p) => p.name).join(", "));
  return filteredPoints;
}

// API路由
router.get("/api/gpt", async (ctx) => {
  console.log(
    "API /api/gpt called with parameters:",
    ctx.request.url.searchParams.toString(),
  );
  const userPrompt = ctx.request.url.searchParams.get("prompt");
  const sessionID = ctx.request.url.searchParams.get("sessionId");
  //const relevantPointsArray = ctx.request.url.searchParams.get("name");
  const state = sessions.get(sessionID) || { stage: 1, inputs: [] };
  // 添加当前提示到会话的输入历史中
  state.inputs.push(userPrompt);
  let prompt = "";
  //const relevantPointsArray = []; // 初始化为空数组
  let relevantPointsArray = [];

  console.log("Current session state before switch:", state.stage);
  switch (state.stage) {
    case 1:
      prompt =
        `Initial consultation: The person is working long hours at a computer and experiences discomfort. They say: '${userPrompt}'. Assumpt you are a professional doctor. You will ask a question to get more details based on '${userPrompt}'`;
      state.stage = 2;
      break;
    case 2:
      prompt =
        `Detailed Inquiry: You mentioned '${userPrompt}'. Base on '${userPrompt}', Ask 2 or 3 questions like:Could you please describe the nature 
                of this pain more precisely? Is it constant or intermittent? Does it worsen during work hours? in order 
                to get more details about thier daily status and thier workspace.`;
      state.stage = 3;
      break;
    case 3:
      prompt = `Education and Advice:Provide basic advice for '${userPrompt}'.
                Then, ask questions that using subject of you. Questions can be how do you typically handle any discomfort during 
                you daily routine or do you engage in any particular activities or take breaks to alleviate it. `;
      state.stage = 4;
      break;
    case 4:
      prompt =
        `Based on the patient's situation '${userPrompt}',give breif advice of doing '${userPrompt}'.Then, also recommend 
                TCM Tuina and give a brief introduction of Traditional Chinese Medicine Massage in one sentence. Give instruction of this web page is a Tuina health assistant in one sentence. Ask me would you instested more advices about Tuina in one senrtence.`;
      state.stage = 5; // Reset or further manage follow-up
      break;
    case 5:
      prompt =
        "Tell me that you will show me some visually explore specific techniques only in one short sentence.";
      state.stage = 6; // Reset to the beginning for a new session
      break;
    case 6: {
      console.log("Processing case 6 with userPrompt:", userPrompt);

      // 假设 state.inputs 包含了会话中所有的用户输入
      const allRelevantPoints = new Set(); // 使用 Set 来避免重复的穴位

      // 检查会话中的每个输入，找出匹配的穴位
      console.log("All user inputs:", state.inputs);
      state.inputs.forEach((input) => {
        const relevantPoints = findAcupointsBySymptom(input);
        relevantPoints.forEach((point) => allRelevantPoints.add(point));
      });

      // 转换 Set 为数组以方便进一步处理
      relevantPointsArray = Array.from(allRelevantPoints);

      console.log(
        "Relevant acupoints for case 6:",
        relevantPointsArray.map((p) => p.name).join(", "),
      );

      if (relevantPointsArray.length > 0) {
        prompt =
          `Based on your symptoms, we recommend focusing on the following acupoints: ${
            relevantPointsArray.map((p) => p.name).join(", ")
          }. Each of these points can help alleviate your symptoms.`;
      } else {
        prompt =
          "Sorry, no acupoints were found that match your symptoms. Please try describing your symptoms differently or consult a healthcare professional.";
      }

      console.log("Generated prompt for GPT:", prompt);
      break;
    }
  }
  console.log("Current session state after switch:", state.stage);
  sessions.set(sessionID, state);
  const response = await gptPrompt(prompt).catch((err) => {
    console.error("Error calling GPT:", err);
    return "Sorry, something went wrong with generating a response.";
  });

  console.log("GPT response:", response);
  const result = {
    prompt: prompt,
    response: response,
    acupoints: relevantPointsArray.map((p) => ({
      name: p.name,
      x: p.x,
      y: p.y,
    })),
  };

  ctx.response.body = JSON.stringify(result);
  ctx.response.type = "application/json";

  // ctx.response.body = result;
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer);

console.log(chalk.green("\nListening on http://localhost:8000"));

await app.listen({ port: 8000, signal: createExitSignal() });
