let authToken = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("メッセージを受け取った:", message);
    if (message.type === "SELECTED_TEXT" && message.text) {
      console.log("受け取った単語:", message.text);

      let column = "";
      if (message.count === 1) {
        column = "A";
      } else if (message.count === 2) {
        column = "B";
      } else if (message.count === 3) {
        column = "C";
      } else if (message.count === 4) {
        column = "D";
      } else if (message.count === 5) {
        column = "E";
      } else if (message.count === 6) {
        column = "F";
      } else if (message.count === 7) {
        column = "G";
      } else if (message.count === 8) {
        column = "H";
      } else if (message.count === 9) {
        column = "I";
      } else if (message.count === 10) {
        column = "J";
      }

      appendToSheet(message.text, column)
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

async function appendToSheet(text, column) {
  try {
    const token = await getAuthToken();
    console.log("取得したトークン:", token);

    const spreadsheetId = "16k0vWG3l6HO4F-WBbGaVJG_b3M-b2Srr4QBIBLxOgo0";

    const nextRow = await getNextRow(spreadsheetId,column);
    console.log("次に追加する行番号:", nextRow);

    const range = `${column}${nextRow}`;

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

  async function getNextRow(spreadsheetId, column) {
    const token = await getAuthToken();

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${column}:${column}?majorDimension=COLUMNS`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`行取得エラー: ${await response.text()}`);
    }

    const data = await response.json();
    return (data.values && data.values[0]) ? data.values[0].length + 1: 2;
  }