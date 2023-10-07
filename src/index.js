const input = document.querySelector("input")
const terms = document.querySelector("#terms")

let worker = null

input.addEventListener("keyup", () => {
  if (worker) {
    worker.terminate()
    worker = null
    terms.innerHTML = ""
  }
  if (input.value.length >= 1) {
    worker = new Worker("/build/worker.js")

    worker.onmessage = (event) => {
      const batch = event.data
      for (const term of batch) {
        const div = document.createElement("div")
        div.textContent = term
        terms.appendChild(div)
      }
    }

    worker.postMessage(input.value)
  }
})
