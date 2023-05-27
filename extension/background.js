// run a script when the page loaded
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // not load on chrome://
  if (tab.url.indexOf("chrome://") > -1) {
    return;
  }

  if (changeInfo.status == "complete") {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: start,
    });
  }
});

function start() {
  const imgs = document.getElementsByTagName("img");
  const imageUrls = [];

  for (let i = 0; i < imgs.length; i++) {
    imageUrls.push(imgs[i].src);
  }

  fetch("http://localhost:3000/image", {
    method: "POST",
    body: JSON.stringify(imageUrls),    
    headers: {
      "Content-Type": "application/json",
    },
  }).then(v => v.json()).then(v => {
    for (let i = 0; i < imgs.length; i++) {
      imgs[i].alt = v[i];
      imgs[i].src = ""
    }

    const body = document.body.innerHTML;

    fetch("http://localhost:3000/dom", {
      method: "POST",
      body: JSON.stringify([body]),    
      headers: {
        "Content-Type": "application/json",
      },
    }).then(v => v.json()).then(v => {
        document.body.innerHTML = v.join("")
        const currImages = document.body.getElementsByTagName('img')

        for (let i = 0; i < currImages.length; i++) {
          currImages[i].src = imageUrls[i]
        }
    }).catch(e => console.log(e))

    for (let i = 0; i < imgs.length; i++) {
      imgs[i].src = imageUrls[i]
    }
  })
}
