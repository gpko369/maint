from django.db import models
from accounts.models import Coach, User

# Create your models here.


class Category(models.Model):
    category = models.CharField('카테고리명', max_length=40)
    image = models.ImageField("대표 이미지", upload_to="category/image/%Y/%m/%d",blank=True, default='category/image/2020/04/16/Category_default.png')
    introduction = models.TextField("소개", blank=True)

    def __str__(self):
        return self.category


class Tags(models.Model):
    tag = models.CharField(max_length=20, verbose_name='태그')

    def __str__(self):
        return self.tag


class Project(models.Model):
    title = models.CharField('제목', max_length=100)
    is_hot = models.BooleanField('추천 여부', default=False)
    coach = models.ForeignKey(Coach, verbose_name='코치',
                              on_delete=models.CASCADE, related_name='project')
    title_image = models.ImageField('대표 이미지', upload_to="projects/title_image/%Y/%m/%d", blank=True,
                                    default='projects/title_image/2019/12/23/Project_default.png')
    status = models.CharField('상태', choices=(
        ("0", "비활성"), ("1", "모집 중"), ("2", "모집 마감"),("3","진행 중")), max_length=10, default=0)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='projects', verbose_name='카테고리')
    difficulty = models.CharField('난이도', max_length=10, choices=(
        ('입문', '입문'), ('심화', '심화'), ('전문가', '전문가')))
    price = models.PositiveIntegerField('가격')
    sale_price = models.PositiveIntegerField('할인 금액', default=0)
    min_capacity = models.PositiveIntegerField('최소 정원', default=1)
    max_capacity = models.PositiveIntegerField('최대 정원', default=20)
    project_term = models.IntegerField('프로젝트 기간', default=4)
    
    place = models.CharField('장소', max_length=100)
    earlybird_due = models.DateField('얼리버드 마감일')
    project_time = models.CharField('프로젝트 시간', max_length=100)
    project_term_detail = models.CharField('프로젝트 상세 기간', max_length=100, default='-')
    project_shortIntro = models.TextField('프로젝트 한 줄 소개')
    project_goal = models.TextField('프로젝트 목표')
    project_caution = models.TextField('유의 사항')
    
    tags = models.ManyToManyField(Tags, verbose_name='태그', symmetrical=False, blank=True)

    def __str__(self):
        return self.title

class Class(models.Model):
    name = models.CharField('이름', max_length=100)
    project = models.ForeignKey(Project, related_name='classes', verbose_name='프로젝트', on_delete=models.CASCADE)
    start_date = models.DateField('시작일')
    end_date = models.DateField('종료일')
    users = models.ManyToManyField(User, related_name='enrolled_class', blank=True)

    def __str__(self):
        return self.project.title + ' ' + self.name


class ProjectIntro(models.Model):
    project = models.OneToOneField(
        Project, on_delete=models.CASCADE, verbose_name='프로젝트')
    project_special = models.TextField('마인트 소개')
    project_process = models.TextField('코치 소개')
    project_toLearn = models.TextField('프로젝트 소개')

    def __str__(self):
        return self.project.title

class Quiz(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, verbose_name='프로젝트')
    question = models.TextField("질문")
    correct_text = models.TextField("정답 시 멘트")
    wrong_text = models.TextField("오답 시 멘트")

    def __str__(self):
        return self.project.title + " : " + self.question

class QuizOptions(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, verbose_name='퀴즈')
    answer = models.TextField("답")
    correct = models.BooleanField("정답 여부")

    def __str__(self):
        return self.answer


# class Curriculum(models.Model):
#     project = models.OneToOneField(Project, verbose_name='프로젝트', on_delete=models.CASCADE, related_name='curriculum')
#     first = models.TextField('1주차')
#     second = models.TextField('2주차')
#     third = models.TextField('3주차')
#     fourth = models.TextField('4주차')
#
#     def __str__(self):
#         return self.project.title


class Curriculum(models.Model):
    project = models.ForeignKey(
        Project, verbose_name='프로젝트', on_delete=models.CASCADE, related_name='curriculum')
    week = models.IntegerField('주차')
    content = models.TextField('내용')
    quiz = models.ForeignKey(Quiz, blank=True, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.project.title + '의 ' + str(self.week) + '주차 커리큘럼'


class Review(models.Model):
    user = models.ForeignKey(User, verbose_name='회원',
                             related_name='review', on_delete=models.CASCADE)
    rate = models.IntegerField('별점', choices=(
        (0, '☆☆☆☆☆'), (1, '★☆☆☆☆'), (2, '★★☆☆☆'), (3, '★★★☆☆'), (4, '★★★★☆'), (5, '★★★★★')), default=5)
    project = models.ForeignKey(Project, verbose_name='프로젝트', on_delete=models.CASCADE, default=0)
    content = models.TextField('내용')
    created_at = models.DateTimeField('작성시간', auto_now_add=True)

    def __str__(self):
        return self.user.name


class Like(models.Model):
    user = models.ForeignKey(
        User, verbose_name='회원', related_name='like_project', on_delete=models.CASCADE)
    project = models.ForeignKey(
        Project, verbose_name='프로젝트', related_name='like_user', on_delete=models.CASCADE)
    created_at = models.DateTimeField('좋아요시간', auto_now_add=True)

    def __str__(self):
        return "{}가 {}를 좋아해요".format(self.user.name, self.project.title)


class Question(models.Model):
    user = models.ForeignKey(User, verbose_name='회원',
                             related_name='questions', on_delete=models.CASCADE)
    project = models.ForeignKey(
        Project, verbose_name='프로젝트', related_name='questions', on_delete=models.CASCADE)
    #title = models.CharField('제목', max_length=50)
    content = models.TextField('내용')
    created_at = models.DateTimeField('작성시간', auto_now_add=True)

    def __str__(self):
        return self.user.name


class Answer(models.Model):
    question = models.ForeignKey(
        Question, verbose_name='question', related_name='answer', on_delete=models.CASCADE)
    #title = models.CharField('제목', max_length=50)
    content = models.TextField('내용')
    created_at = models.DateTimeField('작성시간', auto_now_add=True)

    def __str__(self):
        return self.question.user.name


class ProjectImage(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='images', verbose_name='프로젝트')
    img = models.ImageField('이미지', upload_to="projects/image/%Y/%m/%d")
    resolution = models.IntegerField('해상도', null=True, blank=True)

    def __str__(self):
        return self.project.title + '의 이미지'


class Assignment(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='assignments', verbose_name='프로젝트')
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='assignments', verbose_name='회원')
    title = models.CharField('과제 제목', max_length=100)
    description = models.TextField('과제 설명')
    due = models.DateTimeField('만료일')
    is_done = models.BooleanField('수행 여부', default=False)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성일')

    def __str__(self):
        return self.title
