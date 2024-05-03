// Get references to DOM elements
const promptElement = document.getElementById("prompt");
const sendElement = document.getElementById("send");
const chatContainer = document.getElementById("chat-container");
const sessionId = Math.random().toString(36).slice(2, 11);

let gptCallCount = 0;
let relevantAcupoints = []; // Array to store relevant acupoint information

// Event listener for the send button
sendElement.addEventListener("click", () => {
  const userText = promptElement.value; // Get user input
  displayMessage(userText, "user"); // Display user message
  promptElement.value = ""; // Clear the input field

  // Fetch response from the GPT API with user input and session ID
  fetch(
    `/api/gpt?prompt=${encodeURIComponent(userText)}&sessionId=${sessionId}`,
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("API response received with acupoints:", data.acupoints);
      displayMessage(data.response, "gpt"); // Display GPT's response
      relevantAcupoints = data.acupoints || []; // Store acupoints from the response
      gptCallCount += 1;
      if (gptCallCount === 6) { // Create button on sixth interaction
        createRedirectButton(relevantAcupoints);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      displayMessage("Error communicating with the server.", "error"); // Display error message
    });
});

// Function to display messages in the chat container
function displayMessage(text, sender) {
  console.log("Displaying message:", text);
  const messageElement = document.createElement("p");
  messageElement.innerText = text;
  messageElement.className = sender; // Assign class for styling based on sender
  chatContainer.appendChild(messageElement); // Append message to the container
}

// Function to create a button for exploring more about acupoints
function createRedirectButton(acupoints) {
  console.log("Redirecting with acupoints:", acupoints);
  const button = document.createElement("button");
  button.textContent = "Explore More";
  button.style.position = "absolute";
  button.style.top = "50%";
  button.style.left = "50%";
  button.style.transform = "translate(-50%, -50%)";
  button.style.padding = "20px 40px";
  button.style.fontSize = "2rem";
  button.id = "redirectButton";
  document.body.appendChild(button); // Append button to the body
  console.log("Button added to DOM and event listener set.");

  button.addEventListener("click", () => {
    if (acupoints && acupoints.length > 0) {
      // Create URL with query parameters for each acupoint
      const queryParams = acupoints.map((p) =>
        `name=${encodeURIComponent(p.name)}`
      ).join("&");
      console.log("Redirect URL:", `acupoints.html?draw=true&${queryParams}`);
      window.location.href = `acupoints.html?${queryParams}&draw=true`;
    } else {
      window.location.href = "acupoints.html?draw=true";
    }
  });
}

document.getElementById("prompt").addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault(); // 防止默认表单提交
    document.getElementById("send").click();
  }
});
