import traceback, polling2, time, jsonpickle
from custom_waits import upcoming_section_is_loaded
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))

# Sneaker object for JSON serialization
class Sneaker:
    def __init__(self, link):
        self.link = link


def scroll_to_bottom(driver):

    old_position = 0
    new_position = None

    while new_position != old_position:
        # Get old scroll position
        old_position = driver.execute_script(
            (
                "return (window.pageYOffset !== undefined) ?"
                " window.pageYOffset : (document.documentElement ||"
                " document.body.parentNode || document.body);"
            )
        )
        # Sleep and Scroll
        time.sleep(1)
        driver.execute_script(
            (
                "var scrollingElement = (document.scrollingElement ||"
                " document.body);scrollingElement.scrollTop ="
                " scrollingElement.scrollHeight;"
            )
        )
        # Get new position
        new_position = driver.execute_script(
            (
                "return (window.pageYOffset !== undefined) ?"
                " window.pageYOffset : (document.documentElement ||"
                " document.body.parentNode || document.body);"
            )
        )


sneakers = []

# Navigate to upcoming releases page
driver.get("https://www.nike.com/launch?s=upcoming")

# Scroll to the bottom of the page in effort to load all cards
scroll_to_bottom(driver)

product_cards = WebDriverWait(driver, timeout=10).until(
    upcoming_section_is_loaded(
        (
            By.CSS_SELECTOR,
            ".upcoming-section figure.pb2-sm div.product-card div.ncss-col-sm-12 a.card-link",
        )
    )
)

for product_card in product_cards:
    try:
        link = product_card.get_attribute("href")

        # Append new product to sneakers list
        sneakers.append(Sneaker(link))
    except Exception as e:
        print("Error message: ", e)
        traceback.print_exc()

sneakers_json = jsonpickle.encode(sneakers, unpicklable=False)
with open("nike_upcoming.json", "a") as f:
    f.write(sneakers_json)
    print("Upcoming Nike release data written to nike_upcoming.json")
