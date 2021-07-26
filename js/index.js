const promiseOfSomeJsonData = fetch("../product-list.json")
  .then((r) => r.json())
  .then((data) => {
    return data.responses[0][0].params.userCategories;
  });

window.addEventListener("load", async () => {
  let someData = await promiseOfSomeJsonData;

  demoP = document.getElementById("demo");
  someData.forEach(function (item) {
    newDiv = document.createElement("div");
    newDiv.setAttribute("class", "divCategoryTitle");
    newlistitem = document.createElement("li");
    newlistitem.setAttribute("class", item);
    newA = document.createElement("a");
    newA.setAttribute("class", "categoryTitle");
    newA.setAttribute("onclick", "getProducts(this)");

    newA.setAttribute("id", item);
    //---->Size ozel kategorisinden baslatma
    if (newA.getAttribute("id") == "Size Özel") {
      newA.click();
    }
    newA.innerHTML = item;

    demoP.appendChild(newDiv);
    newDiv.appendChild(newlistitem);
    newlistitem.appendChild(newA);
  });
});

async function getProducts(obj) {
  id = obj.getAttribute("id");

  const getCategoriesData = fetch("../product-list.json")
    .then((r) => r.json())
    .then((data) => {
      var newData = new Array(data.responses[0][0].params.recommendedProducts);

      return newData;
    });
  let products = document.getElementById("products");
  products.innerHTML = ""; //once temizle
  if (document.getElementsByClassName(id)[0]) {
    var li = document.querySelectorAll("li");
    var a = document.querySelectorAll("a");
    for (let i = 0; i < li.length; i++) {
      li[i].classList.remove("active");
      for (let j = 0; j < a.length; j++) {
        a[j].classList.remove("active");
      }
    }
  }

  let categoriesData = await getCategoriesData;
  for (var i = 0; i < categoriesData.length; i++) {
    var obj = categoriesData[i];
    for (var key in obj) {
      var value = obj[key];
      if (id === key) {
        var selectedLi = document.getElementsByClassName(id)[0];
        var selectedA = document.getElementById(id);

        selectedA.classList.add("active");
        selectedLi.classList.add("active");
        value.forEach(function (item) {
          var a = `<div class="product" id="${item.productId}">
            <picture>
              <img class="lazy" loading="lazy" src="${item.image}"  />

            </picture>
            <div class="detail">
              <p><b>${item.name}</b></p>
            </div>
            <div class="price"><samp>${item.priceText}</samp></div>
            <div class="cargo">
            ${(() => {
              if (item.params.shippingFee === "FREE") {
                return `
                  <i class="fas fa-truck"></i>
                  <p>Ücretsiz Kargo</p>
                `;
              } else {
                return `<i style="color:'red'" class="fas fa-truck"></i>
                <p style="color:'red'">Ücretli Kargo</p>`;
              }
            })()}
            </div>
            <div class="button">
              <a onclick="myModal()" class="cartButton" href="#">Sepete Ekle</a>
            </div>
            </div>`;
          products.innerHTML += a;
        });
      }
    }
  }
}
document.addEventListener("DOMContentLoaded", function () {
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function (
      entries,
      observer
    ) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function (lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
});

var closeBtn = document.getElementsByClassName("close-btn")[0];
var alert = document.getElementsByClassName("alert")[0];

myModal = () => {
  alert.classList.remove("hide");
  alert.classList.add("show");
  alert.classList.add("showAlert");
  setTimeout(() => {
    alert.classList.add("hide");
    alert.classList.remove("show");
  }, 1500);
};
closeBtn.addEventListener("click", () => {
  alert.classList.add("hide");
  alert.classList.remove("show");
});
