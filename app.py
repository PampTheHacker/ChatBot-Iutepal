from flask import Flask, render_template, request, jsonify
from chat import get_response

app = Flask(__name__)

@app.get("/")
def index_get():
    return render_template("base.html")

@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    response_data = get_response(text) 
    return jsonify(response_data)


if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Activa el modo debug para ver detalles de errores y en el port se especifica el puerto donde correra el Bot