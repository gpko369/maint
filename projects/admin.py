from django.contrib import admin
from .models import *
from django_summernote.admin import SummernoteModelAdmin, SummernoteInlineModelAdmin

# Register your models here.
class ClassInline(admin.StackedInline):
    model = Class

class QuizOptionInline(admin.StackedInline):
    model = QuizOptions

class QuizModelAdmin(SummernoteModelAdmin):
    list_display = ['project', 'question']
    summernote_fields = ['correct_text', 'wrong_text']
    inlines = [QuizOptionInline]

class ProjectIntroInline(admin.StackedInline, SummernoteInlineModelAdmin):
    model = ProjectIntro

class CurriculumInline(admin.StackedInline, SummernoteInlineModelAdmin):
    model = Curriculum
class ProjectModelAdmin(SummernoteModelAdmin):
    summernote_fields = ['project_intro', 'project_caution']
    list_display = ['id','title', 'coach', 'status']
    list_display_links = ['title','coach']
    inlines = [ProjectIntroInline, CurriculumInline ,ClassInline]

class ProjectIntroAdmin(SummernoteModelAdmin):
    summernote_fields = '__all__'

class CurriculmAdmiin(SummernoteModelAdmin):
    summernote_fields = ['content']
    search_fields = ['project', 'week']

admin.site.register(Project, ProjectModelAdmin)
admin.site.register(ProjectIntro, ProjectIntroAdmin)
admin.site.register(Category)
admin.site.register(Curriculum, CurriculmAdmiin)
admin.site.register(Quiz, QuizModelAdmin)
admin.site.register(QuizOptions)
admin.site.register(Tags)
admin.site.register(Question)
admin.site.register(Review)
admin.site.register(Answer)
admin.site.register(Like)
admin.site.register(ProjectImage)
admin.site.register(Class)
