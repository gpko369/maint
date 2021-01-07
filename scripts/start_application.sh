cd /home/centos/build
source env/bin/activate
gunicorn maint.wsgi --bind 0.0.0.0:8000 --daemon --reload