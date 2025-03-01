const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const { loginUser, cart, orders, publicCarts } = require("./db.js");

require("dotenv").config();
const app = express();
app.use(cors());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

// Q. 2~3번째 응답부터 같은 장바구니만 계속 추천해주는 문제를 해결하려면? Google AI Studio상에서 structured output를 on으로 하고 get the code해서 얻은 코드를 써보는 건 어떨까?
async function getRecommendedPublicCart() {
  try {
    /* const schema = {
      description: "Public cart recommendation",
      type: SchemaType.OBJECT,
      properties: {
        publicCartId: {
          type: SchemaType.NUMBER,
          nullable: false,
        },
        reason: {
          type: SchemaType.STRING,
          nullable: false,
        },
        message: {
          type: SchemaType.STRING,
          nullable: false,
        }
      }
    }; */

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        // responseSchema: schema,
        maxOutputTokens: 100,
        temperature: 1.0,
      }
    });

    const cartJsonData = JSON.stringify(cart, null, 2);
    const ordersJsonData = JSON.stringify(orders, null, 2);
    const publicCartsJsonData = JSON.stringify(publicCarts, null, 2);

    // const selectedOrdersJsonData = ordersJsonData[Math.floor(Math.random() * cartJsonData.length)];

    const prompt = `
    カートデータ ${cartJsonData} から無作為に1つのアイテムを選んでください。
    注文履歴 ${ordersJsonData} からも無作為に1つのアイテムを選んでください。
    
    選ばれた2つのアイテムをもとに、公開カートリスト ${publicCartsJsonData} の中から1つのカートを推薦してください。
    毎回のAPIリクエストで同じカートや注文履歴が繰り返し選ばれないようにランダム性を維持してください。
    
    JSON形式で回答してください。各フィールドの値は **1文、30文字以内** で記述してください。
    {
      "publicCartId": "公開カートID",
      "reason": "公開カートを推薦する理由です。「最近のカートと購入履歴に○○が含まれているため、△△との関連性が高いです」の形式を守ってください。日本語で回答してください。**1文、50文字以内** で記述してください。",
      "message": "ユーザーに対して公開カートを親しみやすく推薦するメッセージです。日本語で回答してください。**1文、30文字以内** で記述してください。"
    }
    `;
    
    /* const prompt = `
      장바구니 ${cartJsonData}에서 무작위로 하나의 항목을 선택해줘.
      주문 이력 ${ordersJsonData}에서 무작위로 하나의 항목을 선택해줘.

      선택된 두 개의 항목을 기반으로, 공개 장바구니 리스트 ${publicCartsJsonData} 중 하나의 항목을 추천해줘.
      매번의 API 요청 때마다 동일한 장바구니 혹은 주문 이력이 계속 선택되지 않도록 랜덤성을 유지해줘.

      JSON 형식으로 답합니다. 각 필드의 값은 **한 문장, 30자 이내**로 작성합니다.
      {
        "publicCartId": "공개장바구니아이디",
        "reason": "공개 장바구니를 추천하는 이유입니다. '최근 장바구니와 구매 내역에 OO가 포함되어 있어 XX와 높은 연관성이 있습니다'라는 형식을 지킵니다. 일본어로 답합니다. **한 문장, 50자 이내**로 작성합니다.",
        "message": "사용자에게 해당 공개 장바구니를 친근하게 권하는 멘트입니다. 일본어로 답합니다. **한 문장, 30자 이내**로 작성합니다."
      }`; */

      /* **주의: "messageToCustomer" 필드는 반드시 포함시켜 줘!!**

      예시 응답:
      {
        "publicCartId": "1",
        "reason": "최근 장바구니와 구매 내역에 계란과 바나나가 포함되어 있어 '다이어트 추천 식단'과 높은 연관성이 있습니다.",
        "messageToCustomer": 건강한 다이어트 식단에 관심 있으시다면, 계란과 바나나가 포함된 '다이어트 추천 식단'을 확인해보세요!"
      }`; */

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);

    const obj = JSON.parse(text);
    console.log(obj);
    console.log("사용 토큰: ", response.usageMetadata.totalTokenCount);

    return obj;
  } catch (e) {
    console.log("Failed to get recommendation");
  }
}

app.get("/api/recommendation", async (req, res) => {
  const result = await getRecommendedPublicCart();
  res.json(result);
});

app.get("/api/user", (req, res) => {
  res.json(loginUser);
});

app.get("/api/publiccarts", (req, res) => {
  res.json(publicCarts);
});

app.listen(3000, () => {
  console.log("Server running!");
});