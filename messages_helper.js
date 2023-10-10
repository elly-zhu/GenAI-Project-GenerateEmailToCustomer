export const delimiter = "####";

function get_product_names(products) {
  return Object.keys(products);
}

function get_product_categories(products) {
  return Object.values(products).map((e) => e.category);
}

function get_product_by_name(products, name) {
  const res = [];
  for (let product of Object.keys(products)) {
    if (product.includes(name)) {
      res.push(products[product]);
    }
  }
  return res;
}

function get_products_by_category(products, category) {
  const res = [];
  for (let product of Object.keys(products)) {
    if (product.category == category) {
      res.push(products[product]);
    }
  }
  return res;
}

export function form_user_content(userInput) {
  return `${delimiter}${userInput}${delimiter}`;
}

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
  let res = `the relavent informations: ` + JSON.stringify(relevant_products);
  
  // NOTE: THIS CUTS THE RELEVANT DATA, IT WILL AFFECT THE ACCURACY, THE REASON FOR THIS IS TO LIMIT THE TOKEN USED
  // A BETTER WAY TO DO THIS IS TO INCREASE THE MAX TOKEN OR IMPROVE THE DATA MATCHING 
  res = res.substring(0, 1000);
  return res;
}

export function form_assistant_content_about_response_language(language) {
  const res = `Please provide answer in language ${language}`;

  return res;
}

export const system_as_assistant_content = `
You are a customer service assistant for a large electronic store. Respond in a friendly and helpful tone, with very concise answers. Make sure to ask the user relevant follow up questions.`;

export function form_system_to_write_email_subject(language, wordlimit = 150) {
  return `Assuming that you provide customer support for an electronic product company. The following text is the customer's comment about the products, please generate an email in ${language} of the comment. The email will be used to be sent to the customer. Please limit the content to ${wordlimit} words. In addition, the return result will be in html format. 
  It will be
  <div>
    <p> Subject: {The generated subject}</p>
    <p> Content: {the generated email content}</p>
    <p> {the generated closing} </p>
  </div>`;
}
