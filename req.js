// here we are sending request to github api and it is sending us response
const axios = require('axios').default;

axios.get("https://api.github.com/users/divya-raichura").then((res) => {
    console.log(res);
})
