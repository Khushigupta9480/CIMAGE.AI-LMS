# core/utils.py
import jwt
from django.conf import settings
from django.http import JsonResponse
from core.models import User

def jwt_auth(view_func):
    def wrapper(request, *args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return JsonResponse({'error': 'No token provided'}, status=401)
        try:
            token = token.replace('Bearer ', '')
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = User.objects(id=payload['id']).first()
            if not user:
                return JsonResponse({'error': 'User not found'}, status=404)
            request.user = user
            return view_func(request, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token expired'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid token'}, status=401)
    return wrapper
