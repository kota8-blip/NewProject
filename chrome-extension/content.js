document.addEventListener('mouseup', () => {
  console.log("mouseup イベントが発火した");

  let selectedText = window.getSelection().toString();
  console.log("取得した単語:", selectedText);

  if (selectedText) {
    let count = localStorage.getItem(selectedText) || 0;
    console.log("Current count", count);
    count++;
    localStorage.setItem(selectedText, count);

    console.log(`${selectedText}の選択回数: ${count}`);

    let column = "";
    if (count === 1) {
      column = "A";
    } else if (count === 2) {
      column = "B";
    } else if (count === 3) {
      column = "C";
    } else if (count === 4) {
      column = "D";
    } else if (count === 5) {
      column = "E";
    } else if (count === 6) {
      column = "F";
    } else if (count === 7) {
      column = "G";
    } else if (count === 8) {
      column = "H";
    } else if (count === 9) {
      column = "I";
    } else if (count === 10) {
      column = "J";
    }

    console.log(`単語 '${selectedText}' の列: ${column}`);
    
  if(chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({ type: "SELECTED_TEXT", text: selectedText, count: count, column: column});
  } else {
    console.log("単語が選択されていません");
  }
  }
});