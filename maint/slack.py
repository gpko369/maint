from slacker import Slacker

def slack_notify(text=None, channel='#테스트', username='결제알리미', attachments=None):
    token = 'xoxb-660589635634-884568809585-d2f0LxdQXijwaJGXbFOCs5FX' #토근값은 공개저장소에 공개되지 않도록 주의
    slack = Slacker(token)
    slack.chat.post_message(text=text, channel=channel, username=username, attachments=attachments)