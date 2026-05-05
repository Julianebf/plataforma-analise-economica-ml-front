from sklearn.ensemble import IsolationForest

def detect_anomalies(df):
    model = IsolationForest(contamination=0.02)
    df["anomaly"] = model.fit_predict(df[["valor"]])
    return df