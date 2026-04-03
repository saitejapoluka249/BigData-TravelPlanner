import sys

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


class AuthPage:
    
    email_selector = (By.XPATH, '//*[@id="input-email"]')
    password_selector = (By.XPATH, '//*[@id="input-password"]')
    name_selector = (By.XPATH, '//*[@id="input-name"]')
    signup_selector = (By.XPATH, '//*[@id="toggle-signup"]')
    signin_selector = (By.XPATH, '//*[@id="toggle-signin"]')
    google_auth_selector = (By.XPATH, '//*[@id="btn-google-login"]')
    submit_selector = (By.XPATH, '//*[@id="btn-submit-auth"]')
    
    
    def enter_email(self, driver, email_text):
        element = driver.find_element(*self.email_selector)
        element.clear()
        element.send_keys(email_text)

    def enter_password(self, driver, password_text):
        element = driver.find_element(*self.password_selector)
        element.clear()
        element.send_keys(password_text)
        
    def enter_name(self, driver, name_text):
        element = driver.find_element(*self.name_selector)
        element.clear()
        element.send_keys(name_text)
    
    def click_signup_toggle(self, driver):
        driver.find_element(*self.signup_selector).click()

    def click_signin_toggle(self, driver):
        driver.find_element(*self.signin_selector).click()

    def click_submit(self, driver):
        driver.find_element(*self.submit_selector).click()
        
    def click_google_auth(self, driver):
        driver.find_element(*self.google_auth_selector).click()
    
    
    
    
    
    
    
    
    
    
   