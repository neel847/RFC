from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. Replace with a specific domain for production.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


class InputData(BaseModel):
  challenge_balance: float
  live_balance: float
  challenge_risk: float
  live_risk: float
  stop_loss: float
  currency_pair: str


pip_values = {
  "EUR/USD": 10, "GBP/USD": 10, "USD/JPY": 6.92, "USD/CHF": 10, "AUD/USD": 10,
  "USD/CAD": 10, "NZD/USD": 10, "EUR/GBP": 10, "EUR/JPY": 6.92, "EUR/AUD": 10,
  "EUR/CAD": 10, "EUR/CHF": 10, "GBP/JPY": 6.92, "GBP/AUD": 10, "GBP/CHF": 10,
  "AUD/JPY": 6.92, "AUD/NZD": 10, "NZD/JPY": 6.92, "CHF/JPY": 6.92
}

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.post("/calculate")
def calculate(data: InputData):
  pip_value = pip_values.get(data.currency_pair, 10)
  challenge_risk_amount = data.challenge_balance * (data.challenge_risk / 100)
  live_risk_amount = data.live_balance * (data.live_risk / 100)


  challenge_lot_size = challenge_risk_amount / (pip_value * data.stop_loss)
  live_lot_size = live_risk_amount / (pip_value * data.stop_loss)


  return {
    "pip_value": pip_value,
    "challenge_risk_amount": challenge_risk_amount,
    "live_risk_amount": live_risk_amount,
    "challenge_lot_size": challenge_lot_size,
    "live_lot_size": live_lot_size
  }

