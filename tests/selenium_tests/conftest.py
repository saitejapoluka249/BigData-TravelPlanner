from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import pytest
from pageobjects.auth_path import AuthPage


auth = AuthPage()

@pytest.fixture(scope="class")
def webdriver_handler():
    
    options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(options=options)
    
    driver.get("http://localhost:3000/auth")
    yield driver

    driver.quit()
    
@pytest.fixture(scope="class")
def login(webdriver_handler: webdriver.Chrome):
    driver = webdriver_handler
    
    print("Locating input fields...")
    auth.enter_email(driver, "test@gmail.com")
    auth.enter_password(driver, "password")
    auth.click_submit(driver)
    
    yield driver
    
@pytest.fixture(scope="class")
def logout(webdriver_handler: webdriver.Chrome):
    driver = webdriver_handler
    
    profile_btn = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, "profile_username"))
    )
    profile_btn.click()
    
    logout_lnk = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, "logout-button"))
    )
    logout_lnk.click()
    driver.get("http://localhost:3000/auth")
    yield driver
    
    