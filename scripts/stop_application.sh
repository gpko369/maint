cd /home/centos/build
kill -9 `ps aux |grep gunicorn |grep maint | awk '{ print $2 }'`