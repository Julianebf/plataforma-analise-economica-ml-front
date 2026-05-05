from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from datetime import datetime, timedelta
import numpy as np

app = FastAPI(
    title="API de Análise Econômica",
    description="API para consumo de indicadores do Banco Central com previsão simples",
    version="2.0.0"
)

# CORS liberado para front-end
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs"


# ================================
# Funções auxiliares
# ================================

def get_now():
    return datetime.now().strftime("%d/%m/%Y %H:%M:%S")


def get_serie(codigo: int):
    hoje = datetime.today()
    series_diarias = [432, 11, 10813, 1]

    if codigo in series_diarias:
        data_final = hoje.strftime("%d/%m/%Y")
        data_inicial = (hoje - timedelta(days=3650)).strftime("%d/%m/%Y")
        url = f"{BASE_URL}.{codigo}/dados?formato=json&dataInicial={data_inicial}&dataFinal={data_final}"
    else:
        url = f"{BASE_URL}.{codigo}/dados?formato=json"

    try:
        response = requests.get(url, timeout=10)

        if response.status_code != 200:
            return []

        data = response.json()
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

    except Exception as erro:
        print("Erro ao buscar dados:", erro)
        return []


def calcular_previsao(serie_historica):
    if len(serie_historica) < 3:
        return None

    # Últimos 6 pontos para tendência recente
    ultimos_dados = serie_historica[-6:]
    valores = [item["valor"] for item in ultimos_dados]

    x = np.arange(len(valores))
    y = np.array(valores)

    # Regressão linear
    coeficiente_angular, coeficiente_linear = np.polyfit(x, y, 1)

    previsao = coeficiente_angular * len(valores) + coeficiente_linear

    return round(float(previsao), 2)


# ================================
# Rotas
# ================================

@app.get("/")
def root():
    return {
        "mensagem": "API Econômica rodando",
        "atualizado_em": get_now()
    }


@app.get("/ipca")
def ipca():
    dados = get_serie(433)
    previsao = calcular_previsao(dados)

    return {
        "indicador": "IPCA",
        "valor_atual": dados[-1]["valor"] if dados else None,
        "previsao_proximo_mes": previsao,
        "dados_ultimos_12_meses": dados[-12:] if dados else [],
        "ultima_data_real": dados[-1]["data"] if dados else None
    }


@app.get("/selic")
def selic():
    dados = get_serie(432)
    previsao = calcular_previsao(dados)

    return {
        "indicador": "SELIC",
        "valor_atual": dados[-1]["valor"] if dados else None,
        "previsao_proxima_taxa": previsao,
        "dados_ultimos_12_registros": dados[-12:] if dados else [],
        "ultima_data_real": dados[-1]["data"] if dados else None
    }


@app.get("/dolar")
def dolar():
    dados = get_serie(10813)
    previsao = calcular_previsao(dados)

    return {
        "indicador": "USD/BRL",
        "valor_atual": dados[-1]["valor"] if dados else None,
        "previsao_proximo_dia": previsao,
        "dados_ultimos_30_dias": dados[-30:] if dados else [],
        "ultima_data_real": dados[-1]["data"] if dados else None
    }


@app.get("/dashboard")
def dashboard():
    ipca_dados = get_serie(433)
    selic_dados = get_serie(432)
    dolar_dados = get_serie(10813)

    return {
        "ipca": {
            "valor_atual": ipca_dados[-1]["valor"] if ipca_dados else None,
            "previsao": calcular_previsao(ipca_dados)
        },
        "selic": {
            "valor_atual": selic_dados[-1]["valor"] if selic_dados else None,
            "previsao": calcular_previsao(selic_dados)
        },
        "dolar": {
            "valor_atual": dolar_dados[-1]["valor"] if dolar_dados else None,
            "previsao": calcular_previsao(dolar_dados)
        },
        "atualizado_em": get_now()
    }