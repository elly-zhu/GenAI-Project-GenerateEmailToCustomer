export const delimiter = "####";

function get_product_names(products) {
  return Object.keys(products);
}

function get_products_by_category(products, categories) {
  const res = [];
  for (let product of Object.keys(products)) {
    if (categories.includes(products[product].category)) {
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
  const category_key_words = [];
  let relevant_products = [];
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

  let res = `the relavent informations: ${JSON.stringify(relevant_products)} ${
    same_category_products.length > 1
      ? ", and other products in the same category are " +
        same_category_products.join(", ")
      : "."
  }`;

  // NOTE: THIS CUTS THE RELEVANT DATA, IT WILL AFFECT THE ACCURACY, THE REASON FOR THIS IS TO LIMIT THE TOKEN USED
  // YOU COULD INCREASE THIS LIMIT
  res = res.substring(0, 1000);
  console.log(">>>>");
  console.log(res);
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
