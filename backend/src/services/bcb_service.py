import requests
import pandas as pd

def get_selic():
    url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados?formato=json"
    
    response = requests.get(url)
    data = response.json()

    df = pd.DataFrame(data)

    df["valor"] = df["valor"].astype(float)
    df["data"] = pd.to_datetime(df["data"], dayfirst=True)

    return df