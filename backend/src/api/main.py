from fastapi import FastAPI
from src.services.bcb_service import get_selic
from src.ml.anomaly import detect_anomalies

app = FastAPI(
    title="API de Análise Econômica com Machine Learning"
)

@app.get("/")
def root():
    return {"message": "API rodando"}

@app.get("/selic")
def selic():
    df = get_selic()
    return df.tail(50).to_dict(orient="records")

@app.get("/anomalias")
def anomalias():
    df = get_selic()
    df = detect_anomalies(df)

    anomalies = df[df["anomaly"] == -1]

    return anomalies.to_dict(orient="records")