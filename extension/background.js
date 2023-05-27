function reddenPage() {
  document.body.style.backgroundColor = "red";
  const metas = document.head.getElementsByTagName('meta');

  const body = document.body.innerHTML;
  const bodyArray = [];

  for (let i = 0, j = 0; i < bodyArray.length; i++) {
    
  }

  console.log(bodyArray)
}

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: reddenPage,
    });
  }
});
