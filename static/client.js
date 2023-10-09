async function postData(url, data) {
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document
  .getElementById("questionForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const questionInputBox = document.getElementById("question");
    const question = questionInputBox.value;
    const language = document.getElementById("language").value;

    const data = {
      question,
      language,
    };

    const chatPanel = document.getElementById("chatPanel");

    chatPanel.innerHTML =
      chatPanel.innerHTML + `User: ${question} (answer in ${language})<br/>`;

    // Post to ask_question endpoint and handle the response
    console.log(`Calling /answer_questions with ${JSON.stringify(data)}`);
    document.querySelector("#questionForm .loader").classList.remove("hide");
    postData("/answer_questions", data)
      .then((response) => {
        const res = response?.data;
        if (res) {
          chatPanel.innerHTML =
            chatPanel.innerHTML + `System: ${res} <br/><br/>`;
          questionInputBox.innerHTML = "";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        chatPanel.innerHTML =
          chatPanel.innerHTML + `System Error: ${error} <br/>`;
      })
      .finally(() => {
        document.querySelector("#questionForm .loader").classList.add("hide");
      });
  });

document
  .getElementById("commentForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const comment = document.getElementById("comment").value;
    const language = document.getElementById("language").value;

    const data = {
      comment,
      language,
    };

    const emailPanel = document.getElementById("emailPanel");
    emailPanel.innerHTML = ""; // clear t
    console.log(`Calling /write_emails with ${JSON.stringify(data)}`);
    // Post to ask_question endpoint and handle the response
    document.querySelector("#commentForm .loader").classList.remove("hide");
    postData("/write_emails", data)
      .then((response) => {
        const res = response?.data;
        if (res) {
          emailPanel.innerHTML = res;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        document.querySelector("#commentForm .loader").classList.add("hide");
      });
  });

function clearChatHistory() {
  const chatPanel = document.getElementById("chatPanel");
  chatPanel.innerHTML = "";
}
