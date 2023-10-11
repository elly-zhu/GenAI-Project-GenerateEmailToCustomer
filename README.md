# GenAI-Project-GenerateEmailToCustomer

### More Details
https://docs.google.com/presentation/d/1Zy-3FVFw1AjDzwoTLo-BQzhvX0LPrLe4q0g9NmBjFu8/edit?usp=sharing 

### Objectives
Build a web-based system that can generate customer support emails and answer questions about the provided products using the OpenAI API.

 - Allow the user to specify the products by providing product data in JSON format.
 - Allow the user to choose response languages.
 - Allow the user to enter questions in any language.
 - Allow the user to generate a draft email.
 - Allow the user to view chat histories.
 - The system searches the product lists based on the user's question, providing relevant product information to ChatGPT for generating specific localized data and enhancing accuracy for the given use case.

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

function get_product_relevant_info(products, userInput) {
  const product_name_list = get_product_names(products);
  const category_key_words = [];
  let relevant_products = [];
  console.log({ userInput });
  for (let product_name of product_name_list) {
    if (userInput.includes(product_name)) {
      relevant_products.push(products[product_name]);
      category_key_words.push(products[product_name]?.category);
    }
  }

  let same_category_products = get_products_by_category(
    products,
    category_key_words
  ).map((e) => e.name);

  // remove duplicates in the list
  relevant_products = [...new Set(relevant_products)];

  const relevantInfo = `the relevant informations: ${JSON.stringify(
    relevant_products
  )} ${
    same_category_products && same_category_products.length > 1
      ? ", and other products in the same category are " +
        same_category_products.join(", ")
      : "."
  }`;

  return relevantInfo;
}

export function form_assistant_content_about_product(
  products,
  userInput,
  maxLength = 1000
) {
  userInput = userInput.replace("?", "");

  let relevantInfo = get_product_relevant_info(products, userInput);

  // NOTE: THIS CUTS THE RELEVANT DATA, IT WILL AFFECT THE ACCURACY, THE REASON FOR THIS IS TO LIMIT THE TOKEN USED
  // YOU COULD INCREASE THIS LIMIT
  relevantInfo = relevantInfo.substring(0, maxLength);
  console.log(">>>>");
  console.log(relevantInfo);
  return relevantInfo;
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
- Ask the system to generate comment about products in chosen language

```javascript
export function form_system_to_generate_random_product_comment(
  products,
  language,
  userInput = undefined,
  maxWordLength = 100
) {
  // if there is a user input, use that, otherwise, use a random product name as a base

  const base_product =
    userInput && userInput.trim().length > 2
      ? userInput
      : get_random_product_name(products);

  const relevantInfo = get_product_relevant_info(products, base_product);

  return `
    The following text is the products' descriptions 
    ${relevantInfo}, 
    Please generate a ${maxWordLength} words comment about the products in language ${language}.`;
}

```

### Email Generator Examples
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/0c7ffbf8-46bd-4caa-a441-3152cc86e20d)
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/1e9d15ab-d36d-4e59-b310-bf758ab0a45b)
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/2e7ef86c-bb81-42a4-89dc-073dc5ccaae3)
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/e45d279d-d9ca-4a19-b5ff-b01b0b4142ad)


### Chatbot Examples
![image](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/a4a8e1dd-3bbc-4486-abb0-b909cc25935e)

### Demo recording
[emailGeneratorDemo.webm](https://github.com/elly-zhu/GenAI-Project-GenerateEmailToCustomer/assets/22209839/1ce1b031-b4eb-4e21-98e2-504dbca2c1ec)


