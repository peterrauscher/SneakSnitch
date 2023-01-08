class image_component_not_loading:
    def __init__(self, locator, product_card):
        self.locator = locator
        self.product_card = product_card

    def __call__(self, driver):
        element = self.product_card.find_element(*self.locator)
        done_loading = (
            "https://www.nike.com/assets/experience/dotcom-snkrs/ux/builds/spinner"
            not in element.get_attribute("src")
        ) and ("loading" != element.get_attribute("alt"))
        if done_loading:
            return element
        else:
            return False


class upcoming_section_is_loaded:
    def __init__(self, locator):
        self.locator = locator

    def __call__(self, driver):
        # element = driver.find_element(*self.locator)
        PRODUCT_CARDS = driver.find_elements(*self.locator)
        return PRODUCT_CARDS
