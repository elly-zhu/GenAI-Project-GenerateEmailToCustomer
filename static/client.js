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
      chatPanel.innerHTML +
      `User: ${question} (Selected language: ${language})<br/>`;

    // Post to ask_question endpoint and handle the response
    console.log(`Calling /answer_questions with ${JSON.stringify(data)}`);
    document.querySelector("#questionForm .loader").classList.remove("hide");
    postData("/answer_questions", data)
      .then((response) => {
        const res = response?.data;
        if (res) {
          chatPanel.innerHTML =
            chatPanel.innerHTML + `System: ${res} <br/><br/>`;
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
    document
      .querySelector("#commentForm .output .loader")
      .classList.remove("hide");
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
        document
          .querySelector("#commentForm .output .loader")
          .classList.add("hide");
      });
  });

document
  .getElementById("chat_clear")
  .addEventListener("click", function (event) {
    const chatPanel = document.getElementById("chatPanel");
    chatPanel.innerHTML = "";
  });

document
  .getElementById("comment_clear")
  .addEventListener("click", function (event) {
    const commentPanel = document.getElementById("comment");
    commentPanel.innerText = "";
  });

document
  .getElementById("generate_comment_anchor")
  .addEventListener("click", function (event) {
    const comment = document.getElementById("comment").value;
    const gen_languageELe = document.getElementById("gen_language");

    const gen_language = gen_languageELe.selectedOptions[0].value;

    console.log(`Genereate comment in ` + gen_language);

    const data = {
      comment,
      gen_language,
    };

    document
      .querySelector("#commentForm .input .loader")
      .classList.remove("hide");

    document.getElementById("comment").value = "";

    postData("/generate_comment", data)
      .then((response) => {
        const res = response?.data;
        if (res) {
          document.getElementById("comment").value = res;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        document
          .querySelector("#commentForm .input .loader")
          .classList.add("hide");
      });
  });
