from django.test import TestCase
from .models import Project, Class
from payment.models import Apply

# Create your tests here.

def change_project_to_class():
    #Class가 없는 project를 찾습니다.
    ncp = Project.objects.filter(classes__isnull=True).distinct()
    for a in ncp:
        Class.objects.create(name='default', project=a, start_date='2020-04-01', end_date='2020-04-02')

    #기존 Apply에 p_class를 추가합니다.
    #해당 Apply의 project에 달린 class들 중 첫번째 class에 할당합니다.
    nca = Apply.objects.filter(p_class__isnull=True)
    for a in nca:
        a.p_class = a.project.classes.first()
        a.save()
