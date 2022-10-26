// interface Tracker {
//   track(event: string, ...tags: string[]): void
// }

const trackUrl = "http://localhost:8001/track";

class Tracker {
  #intervalID;
  #data;

  constructor(window) {
    this.#intervalID = 0;
    this.#data = [];

    window.addEventListener("beforeunload", () => {
      this.#postData("beforeunload");
      this.#data = [];
      clearInterval(this.#intervalID);
    });

    this.#start();
  }

  #start = () => {
    this.#intervalID = setInterval(() => {
      this.#postData("interval");
      this.#data = [];
    }, 1000);
  };

  #handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  #postData = (reason) => {
    if (!this.#data.length) return;

    const tempData = this.#data;
    console.info(reason, "this.data", this.#data);

    fetch("http://localhost:8001/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tempData),
      keepalive: true,
    })
      .then(this.#handleErrors)
      .then((response) => {
        console.log("ok", response);
      })
      .catch((error) => {
        this.#data.push(...tempData);
        console.log("fetch error", error);
      });
  };

  track = (event, ...tags) => {
    const newEvent = {
      event: event,
      tags: tags,
      url: window.location.href,
      title: document.title,
      ts: new Date().toISOString(),
    };
    this.#data.push(newEvent);
    if (this.#data.length >= 3) {
      this.#postData(">=3");
      this.#data = [];
    }
  };
}

window.tracker = new Tracker(window);
