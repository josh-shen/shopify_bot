# Shopify Bot

## Server backend
Backend API deployed on Cloudflare Workers.
Uses data from POST request from user to find items on a specified Shopify site. Returns matching item sizes, availability, price, and with immediate checkout link for items found in stock.

## App frontend
JS React webapp to interact with server backend. 
Select store to search, enter a keyword in search bar for item to search for.
Any items found matching the keyword will be displayed on the page with a checkout link generated for each item in stock.

<p align="center">
  <img src="capture.gif">
 </p>
<sub><sub>use password coffee</sub></sub>