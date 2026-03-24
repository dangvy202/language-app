import requests

USER_SERVICE_URL = "https://reasons-elected-standing-receptor.trycloudflare.com/api/v1/user/info"
def get_user(user_id):
    try:
        response = requests.get(f"{USER_SERVICE_URL}/{user_id}")
        if response.status_code == 200:
            return response.json()['data']
    except Exception:
        pass
    return None