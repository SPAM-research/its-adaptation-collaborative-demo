FROM python:3.12.2
COPY requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py /app/main.py
COPY models.py /app/models.py
COPY schemas.py /app/schemas.py
COPY utils.py /app/utils.py

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EXPOSE 80 8000
