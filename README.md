# MAINT

## 프레임워크

Django: 백엔드 프레임워크

#가상환경 설정
virtualenv env

```bash
python manage.py runserver
```

localhost:8000 포트에 django 서버가 개설

Django-graphene: django에서 프론트와 소통하기 위한 GraphQL 라이브러리  
Graphene-JWT: JSON 형태의 토큰 저장 방식
Apollo: react 에서 api 소통을 위한 GraphQL 라이브러리  
React: 프론트엔드 라이브러리
React-cookie: React 에서 쿠키를 다루기 위한 라이브러리
Semantic UI React:

```bash
npm install react-cookie
yarn add semantic0-ui-react
```

## 사용툴

Git: 코드 저장소 - github, 관리 - sourcetree

##사용자 인증
JWT 형태의 토큰을 쿠키 형태로 저장

#Postgresql 설치
sudo yum install postgresql postgresql-devel python-devel
export PATH=/path/to/compiled/postgresql/bin:"\$PATH"

#Gunicorn 서버 돌리기
gunicorn maint.wsgi --bind 0.0.0.0:8000

python manage.py collectstatic

#서버 설정
locale 설정

```bash
sudo vi /etc/default/locale
```

다음을 추가한 뒤 서버에 재접속한다.

```bash
LC_CTYPE="en_US.UTF-8"
LC_ALL="en_US.UTF-8"
LANG="en_US.UTF-8"
```

패키지 정보 업데이트

```bash
sudo yum update
```

Python 패키지 매니저 설치

python 3.6.8 사용
sudo yum install python36

```bash
sudo yum install python-pip
```

zsh 설치

```bash
sudo yum install zsh
```

git 설치

```bash
sudo yum install git
```

oh my zsh 설치

```bash
sudo curl -L http://install.ohmyz.sh | sh
```

기본 쉘을 zsh로 변경한 뒤 재접속 (chsh 다음에 유저명을 입력해주어야한다.)

```bash
sudo yum install util-linux-user
sudo chsh centos -s /bin/zsh
```

sudo yum add yarn

##Codedeploy
https://jojoldu.tistory.com/281 참조

#AWS CLI 설치
sudo yum install -y awscli

sudo yum wget

#AWS Codedeploy

sudo aws configure

wget https://aws-codedeploy-ap-northeast-2.s3.amazonaws.com/latest/install

sudo yum install ruby

chmod +x ./install

sudo ./install auto

sudo yum install python36

#yarn (및 nodejs) 설치
curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -

sudo yum install nodejs

curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo

sudo rpm --import https://dl.yarnpkg.com/rpm/pubkey.gpg

sudo yum install yarn

#python 가상환경 설정

sudo pip3 install virtualenv

gunicorn maint.wsgi --bind 0.0.0.0:8000
