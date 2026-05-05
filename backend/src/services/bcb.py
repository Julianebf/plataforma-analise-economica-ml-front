import requests
from datetime import datetime

BASE_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs"


def get_serie(codigo: int, data_inicial: str = "01/01/2010"):
    url = f"{BASE_URL}.{codigo}/dados?formato=json&dataInicial={data_inicial}"

    try:
        response = requests.get(url, timeout=10)

        if response.status_code != 200:
            print(f"Erro HTTP {response.status_code} ao buscar série {codigo}")
            return []

        data = response.json()

        if not isinstance(data, list):
            print("Resposta inválida:", data)
            return []

        resultado = []

        for item in data:
            try:
                valor = item.get("valor")
                data_str = item.get("data")

                if valor is None or data_str is None:
                    continue

                resultado.append({
                    "data": datetime.strptime(data_str, "%d/%m/%Y"),
                    "valor": float(valor)
                })

            except:
                continue

        # 🔥 garante ordem cronológica
        resultado.sort(key=lambda x: x["data"])

        return resultado

    except Exception as e:
        print(f"Erro ao buscar série {codigo}:", e)
        return []