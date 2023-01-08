import requests
import json
import re

# Request the page source for Upcoming releases
r = requests.get("https://www.nike.com/launch?s=upcoming")
# Find React state loading script
react_app_script = re.search("<script>document.getElementById.*</script>", r.text)
# Extract only the state's JSON payload
react_state_json = (
    "{"
    + react_app_script.group()
    .split("{", 2)[2]
    .split("};window.initilizeAppWithHandoffState", 1)[0]
    + "}"
)
# Load the JSON into a dictionary
react_state = json.loads(react_state_json)
upcoming_sneakers = react_state.product.threads.data.items
for sneaker_id in upcoming_sneakers:
    Sneakers.

# TODO REMOVE!! For testing purposes only
filename = "json/upcoming_page_onload_state.json"
with open(filename, "a") as f:
    f.write(json.dumps(react_state))
    print("Window preload state for upcoming page written to " + filename)
