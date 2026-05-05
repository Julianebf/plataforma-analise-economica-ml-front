import requests

BASE_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs"


def get_selic():
    url = f"{BASE_URL}.432/dados?formato=json&dataInicial=01/01/2000"

    try:
        response = requests.get(url, timeout=10)

        if response.status_code != 200:
            return []

        data = response.json()

        if not isinstance(data, list):
            return []

        resultado = []

        for item in data:
            try:
                resultado.append({
                    "data": item["data"],
                    "valor": float(item["valor"])
                })
            except:
                continue

        return resultado

    except Exception as e:
        print("Erro SELIC:", e)
        return []