let authToken = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("メッセージを受け取った:", message);
    if (message.type === "SELECTED_TEXT" && message.text) {
      console.log("受け取った単語:", message.text);

      appendToSheet(message.text)
      .then(() => {
        console.log("スプレッドシートに反映しました");
      })
      .catch((error) => {
        console.error("スプレッドシート更新エラー", error);
      });
    }
});

chrome.runtime.onInstalled.addListener(() => {
  getAuthToken().then((token) => {
    authToken = token;
    console.log(`認証トークン:`, authToken);
  }).catch((error) => {
    console.error(`認証エラー:`, error);
  });
});

async function appendToSheet(text) {
  try {
    const token = await getAuthToken();
    console.log("取得したトークン:", token);

    const spreadsheetId = "16k0vWG3l6HO4F-WBbGaVJG_b3M-b2Srr4QBIBLxOgo0";
    const range = "Sheet1!A:A";

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [[text]],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`スプレッドシート更新エラー: ${await response.text()}`);
    }

    console.log("スプレッドシートにデータを追加しました");
  } catch (error) {
    console.error(error);
  }
}

async function getAuthToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          reject(new Error(`認証エラー: ${chrome.runtime.lastError.message}`));
        } else {
          console.log("取得したトークン:", token);
          resolve(token);
        }
      });
    });
  }