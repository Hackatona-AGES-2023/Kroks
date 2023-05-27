function reddenPage() {
  document.body.style.backgroundColor = "red";
  const metas = document.head.getElementsByTagName('meta');

  const body = document.body.innerHTML;
  const bodyArray = [];

  // separate body into array of 1900 caracters
  for (let i = 0; i < body.length; i += 1900) {
    bodyArray.push(body.substring(i, i + 1900));
  }

  fetch("http://localhost:3000/test", {
    method: "POST",
    body: JSON.stringify(bodyArray),
  })
}

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: reddenPage,
    });
  }
});
