# GenAI-Project-GenerateEmailToCustomer

### About
A Node.js project with OpenAI API integration, multi-language support, and JSON file database integration.

The project takes in a JSON-formatted products list and integrates with ChatGPT to generate emails to the customer, as well as generate responses for customers' questions

### Preparation
 - OPEN API Key
   - ![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/03aaef29-76d5-4c4d-92d6-d4bb88572efa)
 - Product json file
   - ![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/71b4b543-e560-440f-a436-750a2affc5d3)

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
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/4192d326-e748-4dc3-87ab-15abc1a5ffe5)
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/73c2be57-2a2f-4e44-b2e4-851fe636c29a)
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/863a0d94-9a90-4c0b-9de6-6c8d23cf243d)
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/eee5deb0-2d43-4bbf-bad2-19cd457810a8)


### Chatbot Examples
