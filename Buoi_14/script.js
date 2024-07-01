
// fetch("https://dummyjson.com/products")
// .then(response => response.json())
// .then((data) => {
//     console.log(data);
//     const newArray = data.products.map((item) => {
//         return `
//             <div class="product-item">
//                 <img src=${item.thumbnail} alt=${item.title}>
//                 <h3>
//                     ${item.title}
//                 </h3>
//                 <div class="brand">
//                     ${item.brand}
//                 </div>
//             </div>
//         `
//     });

//     const htmls = newArray.join("");

//     const productList = document.querySelector(".product-list");

//     productList.innerHTML = htmls;
// })

const fetchApi = async (api) => {
    const response =await fetch(api);
    const data =await response.json();
    return data;
}
fetchApi("https://dummyjson.com/products")
    .then((data) => {
        console.log(data);
    });
