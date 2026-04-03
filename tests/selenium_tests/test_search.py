from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import pytest
from conftest import webdriver_handler, login
from pageobjects.auth_path import AuthPage
from test_variables import test_variables
from pageobjects.search import searchPage

@pytest.mark.usefixtures("login")
class Test_Frontend_Login():
    @pytest.fixture(autouse=True)
    def setup_method(self, login):
        self.driver = login
        self.search_page = searchPage()
        
    def test_search(self):
        self.search_page.enter_source(self.driver, "New York, New York")
        self.search_page.enter_destination(self.driver, "Denver, Colorado")
        self.search_page.set_dates(self.driver, "Choose Saturday, April 25th, 2026", "Choose Thursday, April 30th, 2026")
        self.search_page.click_submit(self.driver)
        
        assert self.search_page.is_options_label_displayed(self.driver), "Expected options label to be visible after search, but it was not."
        
        
        
    
        