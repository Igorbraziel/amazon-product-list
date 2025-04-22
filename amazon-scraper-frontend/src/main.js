document.getElementById("scrapeBtn").addEventListener("click", async () => {
  const keyword = document.getElementById("keyword").value;
  const res = await fetch(`http://localhost:3000/api/scrape?keyword=${keyword}`);
  const data = await res.json();

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  data.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.image}" width="100" />
      <h3>${product.title}</h3>
      <p>Rating: ${product.rating}</p>
      <p>Reviews: ${product.reviews}</p>
    `;
    resultsDiv.appendChild(div);
  });
});


