import graphene
from graphene import relay
from graphene_django.types import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphql_jwt.decorators import login_required
from .models import *

class CustomNode(relay.Node):
    class Meta:
        name = 'Node'

    @staticmethod
    def to_global_id(type, id):
        return id

    @staticmethod
    def get_node_from_global_id(info, global_id, only_type=None):
        # if only_type:
        #     # We assure that the node type that we want to retrieve
        #     # is the same that was indicated in the field type
        #     assert type == only_type._meta.name, 'Received not compatible node.'

        model = getattr(Query, info.field_name).field_type._meta.model
        return model.objects.get(id=global_id)

class TagsType(DjangoObjectType):
    class Meta:
        model = Tags

class LikeType(DjangoObjectType):
    class Meta:
        model = Like
class ProjectIntroType(DjangoObjectType):
    class Meta:
        model = ProjectIntro

class CurriculumType(DjangoObjectType):
    class Meta:
        model = Curriculum

class CategoryType(DjangoObjectType):
    class Meta:
        model = Category

class ClassType(DjangoObjectType):
    class Meta:
        model = Class

class QuizOptionsType(DjangoObjectType):
    class Meta:
        model = QuizOptions

class QuizType(DjangoObjectType):
    class Meta:
        model = Quiz

class ProjectImageType(DjangoObjectType):
    class Meta:
        model = ProjectImage

    image_url = graphene.String()
    def resolve_image_url(self, info):
        return self.img.url

class ReviewType(DjangoObjectType):
    class Meta:
        model = Review
        fields = '__all__'
        filter_fields = {'project__id': ['exact']}
        interfaces = (CustomNode,)

class QuestionNode(DjangoObjectType):
    class Meta:
        model = Question
        filter_fields = {'project__id' : ['exact']}
        interfaces = (CustomNode,)

class ProjectType(DjangoObjectType):
    class Meta:
        model = Project
        convert_choices_to_enum = ['낮음', '중간', '높음']
        fields = '__all__'
        filter_fields = {'title': ['exact', 'icontains'],
                         'coach' : ['exact'],
                         'coach__name' : ['icontains'],
                         'is_hot' : ['exact'],
                         'tags' : ['exact', 'icontains'],
                         'category__category': ['exact'],
                         'status' : ['exact','gt', 'lt']}
        interfaces = (CustomNode, )

    title_image_url = graphene.String()
    tags = graphene.List(TagsType)
    like = graphene.Boolean()
    classes = graphene.List(ClassType)
    quiz = graphene.List(QuizType)
    images = graphene.List(ProjectImageType)
    curriculum = graphene.List(CurriculumType)
    intro = graphene.Field(ProjectIntroType)

    def resolve_title_image_url(self, info):
        return self.title_image.url

    def resolve_tags(self, info):
        return self.tags.all()
    
    def resolve_classes(self,info):
        return self.classes.all()

    def resolve_like(self, info):
        if not info.context.user.is_authenticated:
            return False
        if Like.objects.filter(project=self, user=info.context.user):
            return True
        else:
            return False
    def resolve_images(self, info):
        return self.images.all()

    def resolve_curriculum(self, info):
        if Curriculum.objects.filter(project=self):
            return Curriculum.objects.filter(project=self)
        else:
            return Curriculum.objects.none()

    def resolve_intro(self, info):
        return self.projectintro



class Query(graphene.ObjectType):
    all_projects = DjangoFilterConnectionField(ProjectType)
    project = CustomNode.Field(ProjectType, id=graphene.ID(required=True))
    all_questions = DjangoFilterConnectionField(QuestionNode)
    question = CustomNode.Field(QuestionNode, id=graphene.ID(required=True))
    like_projects = graphene.List(ProjectType)
    all_categories = graphene.List(CategoryType)
    category = CustomNode.Field(CategoryType, id=graphene.ID(required=True))
    review = CustomNode.Field(ReviewType, id=graphene.ID(required=True))
    all_reviews = DjangoFilterConnectionField(ReviewType)
    category_project = graphene.List(ProjectType, id=graphene.ID(required=True))

    # def resolve_all_projects(self, info, **kwargs):
    #     pass
    #
    # def resolve_project(self, info, **kwargs):
    #     pass

    # all_projects = graphene.List(ProjectType)
    # project = graphene.Field(ProjectType)
    #

    def resolve_project(self, info, id, **kwargs):
        return Project.objects.filter(id=id).select_related('images')

    @login_required
    def resolve_like_projects(self, info, **kwargs):
        return Project.objects.filter(like_user__user=info.context.user)

    def resolve_all_categories(self, info, **kwargs):
        return Category.objects.all()

    def resolve_category_project(self, info, id, **kwargs):
        return Project.objects.filter(category__id=id)



class CreateQuestion(graphene.relay.ClientIDMutation):
    class Input:
        content = graphene.String()
        id = graphene.ID()
    link = graphene.Field(QuestionNode)

    @classmethod
    @login_required
    def mutate_and_get_payload(cls, root, info, **input):
        p_id = input.get('id')
        user = info.context.user
        link = Question(
            content = input.get('content'),
            project = Project.objects.get(id=p_id),
            user = user
        )

        link.save()

        return CreateQuestion(link=link)

class CreateLike(graphene.Mutation):
    is_like = graphene.Boolean()
    project = graphene.Field(ProjectType)

    class Arguments:
        id = graphene.ID()

    # request 결과 Like가 생성되었으면 True, 삭제되었으면 False를 리턴합니다
    @login_required
    def mutate(self, info, id, **kwargs):
        user = info.context.user
        project = Project.objects.get(id=id)
        like = Like.objects.filter(project=project, user=user)

        if like:
            like.delete()
            result = False
        else:
            Like.objects.create(project=project,user=user)
            result=True

        return CreateLike(is_like=result, project=project)

class CreateReview(graphene.Mutation):
    class Arguments:
        id = graphene.ID()
        content = graphene.String()
        rate = graphene.Int()
    
    message = graphene.String()
    
    @login_required
    def mutate(self, info, id, content, rate, **kwargs):
        user = info.context.user
        project = Project.objects.get(id=id)

        Review.objects.create(user=user,project=project,content=content,rate=rate)

        message = "성공적으로 리뷰가 작성되었습니다."

        return CreateReview(message=message)


class Mutation(graphene.AbstractType):
    create_question = CreateQuestion.Field()
    create_like = CreateLike.Field()
    create_review = CreateReview.Field()
