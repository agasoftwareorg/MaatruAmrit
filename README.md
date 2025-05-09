# MaatruAmrit

### Notes
- Command to create an admin user <br>
`python manage.py createsuperuser --username <admin-name> --role ADMIN`

- Get into the server
`ssh root@82.25.104.211`

- Copy Backend Code files from local(Ensure current directory is backend\app\main folder)
`scp -r . root@82.25.104.211:/var/app/django-app/app/main/`

- Status/Start/Stop/ Gunicorn
`service gunicorn status/start/stop`

- Build frontend distribution files (Current directory is frontend\app folder)
`ng build --configuration=production`

- Copy Frontend Code files from local (Ensure current directory is frontend\app\dist\app\browser folder)
`scp -r . root@82.25.104.211:/var/www/html/`

- Status/Start/Stop/ nginx
`service nginx status/start/stop`