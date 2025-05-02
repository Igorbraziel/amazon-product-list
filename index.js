import { JSDOM } from "jsdom";

import axios from "axios";
import express from "express"
import cors from "cors"

const app = express();
const PORT = 3000;

app.use(cors())

app.get("/api/scrape", async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) return res.status(400).json({ error: "Keyword is required" });

  const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        Referer: "https://www.google.com/",
      },
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const items = [
      ...document.querySelectorAll("[data-component-type='s-search-result']"),
    ];
    const products = items.map((item) => {
      const title = item.querySelector("h2 a span")?.textContent || "No title";
      const rating = item.querySelector("i span")?.textContent || "No rating";
      const reviews =
        item.querySelector(".a-size-base.s-underline-text")?.textContent || "0";
      const image = item.querySelector("img")?.src || "";

      return { title, rating, reviews, image };
    });

    res.json(products);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch from Amazon", details: err });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
