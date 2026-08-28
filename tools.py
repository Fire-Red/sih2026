from langchain.tools import tool
import requests
from bs4 import BeautifulSoup
from tavily import TavilyClient
import os
import time
from dotenv import load_dotenv

load_dotenv()

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


@tool
def web_Search(quary: str) -> str:
    '''
    search the web for the given query and return the results as a string.
    '''
    MAX_RESULTS = 5
    results = tavily.search(query=quary, max_results=MAX_RESULTS)

    out = []

    for r in results['results']:
        out.append(f"Title: {r['title']}\nURL: {r['url']}\nSnippet: {r['content'][:300]}\n")

    return "\n".join(out)




@tool
def scrape_url(url: str) -> str:
    '''
    scrape the given url and return the text content as a string.
    '''
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive",
    }

    for attempt in range(3):
        try:
            resp = requests.get(url, timeout=10, headers=headers)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")
            for tag in soup(["script", "style", "header", "footer", "nav"]):
                tag.decompose()
            return soup.get_text(separator='\n', strip=True)[:3000]
        except requests.exceptions.RequestException as e:
            if attempt == 2:
                return f"Error scraping URL after 3 attempts: {e}"
            time.sleep(1.5)

print(scrape_url.invoke("https://www.artificialintelligence-news.com/news/mit-ai-forecasts-extreme-weather-without-historical-data/"))