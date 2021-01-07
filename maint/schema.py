import graphene
from forsite import schema as forsite_schema
from projects import schema as projects_schema
from accounts import schema as accounts_schema
from payment import schema as payment_schema
from accounts.schema import UserType
import graphql_jwt
import graphql_social_auth
from graphql_jwt.decorators import login_required
from maint.slack import slack_notify
import json

from django.contrib.auth import get_user_model

class Query(projects_schema.Query, forsite_schema.Query, accounts_schema.Query, payment_schema.Query ,graphene.ObjectType):
    # This class will inherit from multiple Queries
    # as we begin to add more apps to our project
    pass


class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    r_user = graphene.Field(UserType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(r_user=info.context.user)

class LogoutMutation(graphene.Mutation):
    message = graphene.Boolean()

    @login_required
    def mutate(self, info, **kwargs):
        info.context.jwt_token = 'logout'
        return LogoutMutation(message=True)

class SocialJSONWebToken(graphql_social_auth.SocialAuthJWT):
    r_user = graphene.Field(UserType)

    @classmethod
    def resolve(cls, root, info, social, **kwargs):
        result = super(SocialJSONWebToken, cls).resolve(root, info, social, **kwargs)
        if getattr(info.context, 'jwt_cookie', False):
            info.context.jwt_token = result.token
        return result

class SlackNotify(graphene.Mutation):
    class Arguments:
        channel = graphene.String()
        attachments = graphene.types.json.JSONString()
    
    message = graphene.String()

    def mutate(self, info, channel, attachments, **kwargs):
        slack_notify(channel=channel, attachments=[attachments])

        return SlackNotify(message="전송되었습니다")






class Mutation(accounts_schema.Mutation, projects_schema.Mutation, payment_schema.Mutation, graphene.ObjectType):
    #token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    token_auth = ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    #social_auth = graphql_social_auth.SocialAuthJWT.Field()
    social_auth = SocialJSONWebToken.Field()
    logout_token = LogoutMutation.Field()
    #revoke_token = graphql_jwt.Revoke.Field()
    slack_notify = SlackNotify.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
