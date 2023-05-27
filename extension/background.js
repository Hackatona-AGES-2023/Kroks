chrome.webNavigation.onCompleted.addListener(function (details) {
  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    function: readPage
  })
})

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
