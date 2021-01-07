cd /home/centos/build
source env/bin/activate
sudo rm -r staticfiles
python manage.py collectstatic