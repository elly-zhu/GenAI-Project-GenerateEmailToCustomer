### About
A Node.js project with OpenAI API integration, multi-language support, and JSON file database integration.

The project takes in a JSON-formatted products list and integrates with ChatGPT to generate emails to the customer, as well as generate responses for customers' questions

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
  const categories_list = get_product_categories(products);
  let relevant_products = [];
  for (let word of userInput.split(" ")) {
    for (let product_name of product_name_list) {
      if (product_name.includes(word)) {
        relevant_products.push(get_product_by_name(products, word));
      }
    }
    if (categories_list.includes(word)) {
      for (let category of categories_list) {
        if (category.includes(word)) {
          relevant_products.concat(get_products_by_category(products, word));
        }
      }
    }
  }
  // remove duplicates in the list
  relevant_products = [...new Set(relevant_products)];
  const res = `the relavent informations: ` + JSON.stringify(relevant_products);
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
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/3914ca41-4712-474a-bbe5-e7b02e6e325c)
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/26e42a71-c60c-4057-8b92-15e18c6abe5c)
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/ae4876af-28d0-41ce-8a4d-b6035bc4eded)
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/a6a92118-a2c3-453a-8d8e-0fa01bdd1bd8)

### Chatbot Examples
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/a4a8e1dd-3bbc-4486-abb0-b909cc25935e)

