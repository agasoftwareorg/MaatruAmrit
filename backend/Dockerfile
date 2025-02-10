FROM python:3.13-alpine
WORKDIR /var/app
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 8000
ENV PYTHONUNBUFFERED=1
COPY app .
RUN rm -rf db.sqlite3
RUN python manage.py makemigrations --noinput
RUN python manage.py migrate --noinput
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]