async function fetchUserData() {
  try {
    const response = await fetch("http://localhost:3000/api/user");
    const loginUser = await response.json();

    document.querySelector("h3").innerText = `こんにちは。${loginUser.name}さん！`
  } catch (error) {
    console.log("Failed to read loginUser data");
  }
}

async function fetchPublicCartsData() {
  try {
    const response = await fetch("http://localhost:3000/api/publiccarts");
    const publicCarts = await response.json();
    const container = document.getElementById("publicCartList");

    publicCarts.forEach(publicCart => {
      const publicCartElement = document.createElement("li");
      publicCartElement.innerHTML = `
        <h3>${publicCart.公開カートID}番 ${publicCart.タイトル}</h3>
        <p>${publicCart.説明}</p>
        <p>${publicCart.おすすめ商品}</p>
      `;
      container.appendChild(publicCartElement);
    });
  } catch (error) {
    console.log("Failed to read publicCarts");
  }
}

async function toggleRecommendation() {
  const recommendSection = document.getElementById("recommendSection");
  
  if (recommendSection.style.display === "none") {
    recommendSection.style.display = "block";

    try {
      const response = await fetch("http://localhost:3000/api/recommendation");
      const recommendation = await response.json();
      const container = document.getElementById("recommendation");

      const recommendationElement = document.createElement("li");
      recommendationElement.innerHTML = `
        <h3>${recommendation.publicCartId}番 公開カート</h3>
        <p>${recommendation.message}</p>
      `;

      container.appendChild(recommendationElement);
  
      /* recommendation.forEach(obj => {
        const recommendationElement = document.createElement("li");
        recommendationElement.innerHTML = `
          <h3>${obj.publicCartId}번 공개장바구니</h3>
          <p>${obj.message}</p>
        `;
        container.appendChild(recommendationElement);
      }); */
    } catch (error) {
      console.log("Failed to read recommendation: ", error);
    }    
  } else {
    recommendSection.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchUserData();
  fetchPublicCartsData();

  const recommendButton = document.getElementById("recommendButton");

  recommendButton.addEventListener("click", toggleRecommendation)
});