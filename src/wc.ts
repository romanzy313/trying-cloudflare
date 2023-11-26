class ReefElement extends HTMLElement {
  private count = 0;
  // Instantiate the component
  constructor() {
    super();
    this.innerHTML = "count 0";
    setInterval(() => {
      this.count++;
      this.innerHTML = `count ${this.count}`;
    }, 1000);
  }
}

customElements.define("hello-world", ReefElement);
