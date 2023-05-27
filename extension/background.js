function reddenPage() {
  const body = document.body.innerHTML;
  const imgs = document.getElementsByTagName("img");
  const imageUrls = [];

  for (let i = 0; i < imgs.length; i++) {
    imageUrls.push(imgs[i].src);
  }

  fetch("http://localhost:3000/test", {
    method: "POST",
    body: JSON.stringify([body]),    
    headers: {
      "Content-Type": "application/json",
    },
  }).then(v => v.json()).then(v => {
      console.log(v)
      document.body.innerHTML = v.join("")
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