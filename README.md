# GenAI-Project-GenerateEmailToCustomer

### Objectives
Build a web-based system that can generate customer support emails and answer questions about the provided products using the OpenAI API.

 - Allow the user to specify the products by providing product data in JSON format.
 - Allow the user to choose response languages.
 - Allow the user to enter questions in any language.
 - Allow the user to generate a draft email.
 - Allow the user to view chat histories.

### Design Approach
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/c6ef4929-3e0e-4fcd-9ea7-eabcc208eab2)



### Preparation
 - OPEN API Key
   - ![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/c47b795f-12c1-4ea9-96b6-53b0187e6ffb)
 - Product json file
   - ![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/00f8a2ec-ce37-42fd-86bc-44a5715731b1)


### Implementation
The project has built-in helper functions to generate relevant and meaningful prompts for openai chat completion function
 - Analyze the user-provided comment; find the product in the product database JSON file that matches the user's commented product; provide the relevant information to ChatGPT
```javascript
export function form_assistant_content_about_product(products, userInput) {
  userInput = userInput.replace("?", "");
  const product_name_list = get_product_names(products);
  let relevant_products = [];
  for (let product_name of product_name_list) {
    if (userInput.includes(product_name)) {
      relevant_products.push(products[product_name]);
    }
  }

  // remove duplicates in the list
  relevant_products = [...new Set(relevant_products)];
  let res = `the relavent informations: ` + JSON.stringify(relevant_products);

  // NOTE: THIS CUTS THE RELEVANT DATA, IT WILL AFFECT THE ACCURACY, THE REASON FOR THIS IS TO LIMIT THE TOKEN USED
  // A BETTER WAY TO DO THIS IS TO INCREASE THE MAX TOKEN OR IMPROVE THE DATA MATCHING
  res = res.substring(0, 1500);
  return res;
}

export function form_assistant_content_about_response_language(language) {
  const res = `Please provide answer in language ${language}`;

  return res;
}

```

- Provide information about the user's language preferences to instruct ChatGPT to respond in a specific language setting
```javascript
export function form_assistant_content_about_response_language(language) {
  const res = `Please provide answer in language ${language}`;
  return res;
}
```

- Provide detailed information about the requested format to instruct ChatGPT to respond in an email format with appropriate subject, content, and closing.
```javascript
export function form_system_to_write_email_subject(language, wordlimit = 150) {
  return `Assuming that you provide customer support for an electronic product company. The following text is the customer's comment about the products, please generate an email in ${language} of the comment. The email will be used to be sent to the customer. Please limit the content to ${wordlimit} words. In addition, the return result will be in html format. 
  It will be
  <div>
    <p> Subject: {The generated subject}</p>
    <p> Content: {the generated email content}</p>
    <p> {the generated closing} </p>
  </div>`;
}
```

### Email Generator Examples
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/24d58783-b604-42a7-8657-f86e82b3102f)
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/ae4876af-28d0-41ce-8a4d-b6035bc4eded)
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/a6a92118-a2c3-453a-8d8e-0fa01bdd1bd8)

### Chatbot Examples
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/a4a8e1dd-3bbc-4486-abb0-b909cc25935e)

### Demo recording
[emailGeneratorDemo.webm](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/1ce1b031-b4eb-4e21-98e2-504dbca2c1ec)


