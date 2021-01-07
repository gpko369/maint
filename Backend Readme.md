
# Backend 모델 및 스키마 설명

## 마인트 프로젝트의 모델 및 스키마를 설명하는 문서입니다
앱(App)별로 표시해 두었습니다

### 1. Accounts

회원, 코치 등 이용자(사람)에 관련한 모델 및 기능을 정의하는 앱

#### (1) 모델

**1. User**
: 회원
- email : EmailField
- name(실명) : CharField
- *nickname(별명 - 예정)* : CharField
- gender : CharField[choices F, M]
- project_enrolled : ForeignKey (related_name='project_user')
- birth : DateField
- img : ImageField(프로필사진)
- phone_number : CharField
- oauth_id : CharField
- register_date : DatetimeField
- agree_1 : Bool(이메일 수신 동의)
- agree_2 : Bool(문자 수신 동의)

**2. Coach**
: 코치
- name : CharField
- introduction : TextField(소개)
- carrer : TextField(경력)
- img : ImageField(프로필 사진)
- register_date : DateTimeField(등록 날짜)

**3. SMSAuth**  
: SMS 인증을 위한 모델
- user : OneToOne 유저 모델과 1대1 대응합니다
- auth_number : IntegerField 4자리의 랜덤 인증 번호
- expired_time : 인증 번호 만료기간
- is_verified : Bool. 인증된 경우 True   
- Method  
save() : 인증번호 갱신/생성, 만료기간 갱신/생성, 인증여부 False 설정, 문자보내기를 포함합니다  
verify() : is_verified(인증여부)를 True로 바꿉니다  
send_kakao() : 인증번호 카카오톡을 발송합니다  
validate_number() : 만료기간, 인증번호 일치 여부를 검증합니다. 검증이 완료된 경우 verify() 메소드를 호출하며, is_verified 필드 값을 리턴합니다.


#### (2) 스키마

**1. Query**

1. allUsers : 모든 회원을 리턴합니다
2. allCoaches : 모든 코치를 리턴합니다
3. mypage(로그인 필요) : 로그인이 되어있는 경우 해당 유저를 리턴합니다
4. me(로그인 필요) : 3과 동일합니다. 쓰시는 것 같아서 남겨두었습니다.
5. coach(id:required) : 입력된 id 값에 해당하는 코치를 리턴합니다 
6. user(id:required) : 입력된 id 값에 해당하는 유저를 리턴합니다

**2. Mutation**
(Coach는 관리자 페이지에서 관리하는 것으로 간주, 따로 기록하지 않겠습니다)

1. updateUser(password:required / id, email, name, birth, gender) : id 값이 넘어오면 Update, 넘어오지 않으면 create, 넘어오지 않은 argument는 그 이전의 값을 그대로 유지합니다
2. smsAuth(phone_number:required / auth_number) : phone_number 값만 넘어오면 해당 번호로 인증번호를 전송합니다. 
auth_number가 같이 넘어오는 경우, 해당 번호에 대한 validation을 시행합니다.
3. socialAuth(provider:required / accessToken:required) : provider는 kakao 혹은 facebook입니다. facebook은
현재 작업중입니다. 프론트에서 소셜로그인을 수행한 후 얻은 accessToken을 활용해야합니다.  
이 로그인은 "maint/custom_backend"에서 커스터마이징 된 백엔드를 사용하며, 실제 유저가 없는 경우, 소셜 서비스로부터 
받아온 정보를 통해 자동으로 유저를 생성합니다.

### 2. Forsite

배너, 공지 등 사이트 운영자에게 필요한 모델과 기능을 정의하는 앱

#### (1) 모델

**1,2 MainBanner, SubBanner**
- image : ImageField
- image_mobile : ImageField(모바일 이미지)
- created_at : DateTimeField
- title : CharField
- order : IntegerField(낮을수록 순서가 빠릅니다)
- active : Bool(활성화를 나타냅니다. False인 경우 나타나지 않습니다)
- href : CharField(클릭했을경우 연결될 주소를 포함합니다)
- target : Bool(target blank 설정을 위한 필드입니다)

**3. Notice**
- title : CharField
- text : TextField
- notice_date : DateTimeField('작성날짜'


#### (2) 스키마

**1.Query**
1. allNotices : 모든 공지사항을 리턴합니다
2. allMainBanners : 모든 활성화된 메인배너를 리턴합니다
3. allSubBanners : 모든 활성화된 서브배너를 리턴합니다
4. notice(id:required) : 입력된 id값에 해당하는 공지사항을 리턴합니다
5. mainBanner(id:required) : 입력된 id값에 해당하는 매인배너를 리턴합니다
6. subBanner(id:required) : 입력된 id값에 해당하는 서브배너를 리턴합니다

해당 배너, 공지사항은 관리자 페이지에서 작성할 것으로 간주, Mutation을 작성하지 않았습니다


### 3. Payment

신청, 결제, 쿠폰 등 신청 및 금전적인 것과 관련된 모델과 기능을 정의하는 앱

#### (1) 모델

**1.Coupon**
- amount : PositiveIntegerField(금액)
- code : CharField(코드, blank=True) 비워져 있으면 자동으로 생성됩니다.
- description : CharField(쿠폰 종류)
- is_used : Bool(사용여부)
- user : ForeignKey(User, related_name='coupon', 쿠폰 소유 회원, blank=True)
- apply : ForeignKey(Apply, related_name='coupon', 쿠폰 적용된 신청, null,blank 모두 True)
- due : DateField(마감기한)
- method  
 check(로그인 필요) 쿠폰 소유자와 요청자가 일치하는지, 만료시간은 지나지 않았는지 검증합니다. Bool을 리턴합니다.


**2.Apply**
- project : ForeignKey(Project, 신청 프로젝트)
- user : ForiegnKey(User, 신청한 회원)
- price : IntegerField(가격), 해당 신청에 적용된 쿠폰을 고려하여 자동으로 생성됩니다.)
- created_at : DateTimeField(신청시각)
- order_id : CharField - 주문번호 랜덤으로 생성됩니다. (save() 메소드 참조) 
- is_canceled : Bool(default=False) 취소여부로, 취소시 True를 반환합니다 
- method  
paid : 이와 연결된 payment가 있고, 해당 payment가 verified=True이면 True를 리턴합니다. 그외에는 False를 리턴합니다.  


- payment : OneToOneField(Payment, 결제정보와 1:1대응) --> 사실 Payment 모델에 있습니다
Django에서 OneToOne관계는 해당 상호 모델이름의 소문자(lowercase())형태로 참조 가능합니다

**3.Payment**
- user : ForeignKey(User, 이용자)
- apply : OneToOne(Apply, 신청)
- status : IntegerField 결제상태. 부트페이 검증과정에서 서버에서 얻어온 결제 status의 integer값을 등록합니다.
- method : 결제 수단
- receipt_id : 영수증 ID(검증을 위해 필요합니다, 해당 영수증 ID 내용을 부트페이 서버에서 참조합니다)
- purchased_at : CharField, 결제 승인 시각
- requested_at : CharField, 결제 요청 시각
- verified : Bool. 결제검증여부 status가 1이고, 해당 영수증 ID의 결제 금액이 이 인스턴스의 apply의 결제 금액과 일치한경우, True가 됩니다.
- price : Payment의 인스턴스는 프론트에서 결제가 완료되고 해당 정보가 서버로 넘어오면서 생성됩니다. 해당 프론트단에서의 결제 금액을 확인합니다.

#### (2) 스키마 
**1. Query**
- myApply : login_required. 회원의 신청 내역을 보여줍니다
- myCoupon : login_required. 회원의 쿠폰 목록을 보여줍니다(현재는 이용한 것, 이용하기 전 모두 포함합니다)
- myPayment : login_required. 회원의 결제 내역을 보여줍니다.

**2. Mutation**
- createApply(로그인 필요)  
Arguments : project_id(필수), coupon_id(리스트)(선택)  
설명 : 신청하려는 project_id를 넣으면, 해당 Apply가 생성됩니다. 
- deleteApply(로그인 필요)  
Argument : apply_id (id값 필수)  
요청자가 해당 apply의 user인 경우 해당 apply를 삭제합니다.  
- removeProject(로그인 필요)  
Argument : project_id 필수  
해당 프로젝트를 user의 project_enrolled에서 제거하고, 해당 신청을 취소하며, payment가 있는 경우 취소합니다.
- registerCoupon(로그인 필요)  
Argument : coupon_code(String 필수)  
쿠폰번호를 등록하는 경우, 해당 쿠폰의 소유자가 요청자가 됩니다.  
- VerifyPayment(로그인 필요)  
Argument : receipt_id(ID값 필수), apply_id(ID값 필수)  
프론트단에서 결제가 완료되면, 해당 내용으로 payment를 생성한 후 반환합니다.  
is_verified를 통해 해당 검증 결과를 확인할 수 있습니다. 

### 4. Project

프로젝트 리스트, 프로젝트 상세페이지와 관련된 모델, 기능을 정의하는 앱

#### (1) 모델

**1.Project(Relay 이용)** 
- title : CharField
- coach : ForiegnKey(Coach, related_name='project')
- title_image : ImageField, 대표 이미지
- status : CharField로 0,1,2로 구분됩니다. default는 0입니다.
- category : ForeignKey(Category, related_name='project')
- price : P_integerField
- min_capacity = P_integerField
- max_capacity = P_integerField
- project_startTime = DateTimeField('프로젝트 시작 날짜)
- project_time = TextField(프로젝트 시간)
- project_shortIntro = TextField(프로젝트 소개)
- project_goal = models.TextField('프로젝트 목표')
- project_term = models.IntegerField('프로젝트 기간', default=4)
- project_DayinWeek = models.CharField('프로젝트 요일')
- project_reward = models.TextField('목표 달성 보상')
- project_reward_condition = models.TextField('보상 조건')
- project_caution : Texfield(유의사항)
- deadline = DateTimeField(모집 마감일)
- place = CharField(장소)
- is_hot = Bool(추천여부)
- difficulty = CharField[choices:낮음, 중간,높음]
- latitude : FloatField(위도)
- longtitude : FloatField(경도)
(지도 이용을 위한 위도, 경도)
- tags : ManyToManyField(태그) (Tags 모델과 m2m 관계를 맺습니다. 따라서 태그 등록은 먼저 Tags 모델 생성을 전제로 합니다)

**2.Category**
- category : CharField(카테고리 이름)

**3.Curriculum**
- project : Foreignkey(Project). 커리큘럼 인스턴스 1개는 한 프로젝트의 1(한개의)주차의 커리큘럼에 해당합니다.
- week = IntegerField('주차')
- content = TextField(내용)

**4.Review**
- user : ForeignKey(User, related_name='review')
- rate = IntegerField[choices : 0,1,2,3,4,5]
- content : TextField
- created_at : DateTimeField

**5.Like(좋아요)**
- user : ForeignKey(User, related_name='like_project')
- project : ForeignKey(Project, related_name='like_user')
- created_at : DateTimeField

**6.Question(Relay이용)**
- user : ForeignKey(User, related_name=questions)
- project : ForeignKey(Project, related_name=questions)
- content : TextField
- created_at : DateTimeField

**7.Answer**
- question : ForeignKey(Question, related_name='answer')
- content : TextField
- created_at : DateTimeField

**8.Tags**
- tag : CharField(태그)

**9.ProjectImage**  
(admin에서 등록하는 것으로 생각하겠습니다)
- project : Foreignkey(Project, related_name='images')
- img : ImageField, 이미지 파일
- resolution = IntegerField. 반응형을 위한 필드입니다, null,blank 모두 True

**10.ProjectIntro**  
(Project에 대한 설명을 넣는 곳으로 분리되어 있습니다. project와 1:1로 대응합니다. project 생성후이 모델도 같이 ***생성해주세요***!!)
- project : 1:1로 project와 대응합니다.
- project_special = models.TextField('특별한 점')
- project_process = models.TextField('프로젝트 진행')
- project_toLearn = models.TextField('배우게 될 점')
- project_acquisition = models.TextField('얻을 수 있는 것')
- project_recommend = models.TextField('추천 대상')
#### (2) 스키마
#### 쿼리
1. allProject(title[exact,icontains], coach[id값 exact], coach__name[icontains], is_hot[exact])

*argument는 선택값입니다. 해당 옵션에 따라 search된 모델들을 리턴합니다  
*relay를 이용하기 때문에 다음과 같은 특성을 가집니다  
*edges -> node가 return된 instance의 정보를 갖습니다  
*edges는 cursor값도 포함합니다  
*pageInfo는 startCursor, endCursor, hasNextPage, hasPreviousPage를 가집니다  

```
query {
  allProjects(coach_Name_Icontains:"홍규"){
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
    edges{
      cursor
      node{
        id
        title
        coach {
          name
        }
      }
    }
  }
}


```


2. project(id:required)
- 입력된 id값에 해당하는 project를 리턴합니다. 
- #### 추가필드
- **titleImageUrl** : 이 값은 title_image의 url 값을 리턴합니다.
- **tags** : 이 값은 해당 프로젝트의 태그들을 리턴합니다.
- **like** : 이용자가 좋아요 했는지의 여부를 bool 값으로 리턴합니다
- **images** : 해당 프로젝트에 foreignkey 관계를 가진 이미지들을 리턴합니다.

3. allQuestions(filter_fields : project_Id) : relay
- 인자가 따로 없을 경우에는 모든 question을 return하고, 인자가 있는 경우
입력된 project_Id에 해당하는 question들을 리턴합니다.
```
query {
  allQuestions(project_Id:1){
    edges{
      node{
        id
        content
      	user{
          name
        }
      }
    }
  }
}
```  
4. question(id:required)
- 입력된 id값에 해당하는 question을 리턴합니다.

5. likeProject : login_required
- 회원이 좋아요 한 프로젝트만 리턴합니다.  

6. allCategories:  
- 모든 카테고리를 리턴합니다  

7. categoryProject(id 값 필수):  
- 해당 id 값에 해당하는 카테고리, 그 카테고리에 속해있는 프로젝트를 모두 리턴합니다.



#### Mutation
3. createLike(id:required) - 로그인 필요
- 입력된 id 값에 해당하는 project에 좋아요를 생성합니다. 기존 좋아요가 있는 경우 삭제합니다
- 좋아요가 생성된 경우 true를, 좋아요가 삭제된 경우 false를 리턴합니다.
```
mutation {
  createLike(id:1){
    isLike
  }
}
```

4. createQuestion(content:string, id:해당 프로젝트의 id값)
- 해당 프로젝트에 content라는 질문을 생성합니다.



```python

```
