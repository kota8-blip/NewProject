document.addEventListener('mouseup', () => {
  console.log("mouseup イベントが発火した");

  let selectedText = window.getSelection().toString();
  console.log("取得した単語:", selectedText);

  if (selectedText) {
    chrome.runtime.sendMessage({ type: "SELECTED_TEXT", text: selectedText});
  } else {
    console.log("単語が選択されていません");
  }
});