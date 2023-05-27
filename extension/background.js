function readPage() {
  const body = document.body.innerHTML
  const bodyArray = []

  for (let i = 0; i < body.length; i += 1900) {
    bodyArray.push(body.substring(i, i + 1900))
  }

  fetch("http://localhost:3000/test", {
    method: "POST",
    body: JSON.stringify(bodyArray)
  })
}

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  chrome.tabs.executeScript({
    target: details.tabId,
    function: readPage
  })
})

