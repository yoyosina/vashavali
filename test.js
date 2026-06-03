const { JSDOM } = require("jsdom");
const dom = new JSDOM(`<!DOCTYPE html>
<html>
<body>
  <div id="parent">
    Click me
    <input id="child" type="file" style="display: none" />
  </div>
</body>
</html>`);
const document = dom.window.document;

let parentClicks = 0;
let childClicks = 0;

document.getElementById('parent').addEventListener('click', (e) => {
  parentClicks++;
  console.log('parent clicked', parentClicks);
  if (parentClicks < 5) {
    document.getElementById('child').click();
  }
});

document.getElementById('child').addEventListener('click', (e) => {
  childClicks++;
  console.log('child clicked', childClicks);
});

document.getElementById('parent').click();
