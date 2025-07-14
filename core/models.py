
from mongoengine import Document, StringField, ReferenceField, DateTimeField,ListField,EmailField,CASCADE,FileField
import datetime
from bson import ObjectId
from mongoengine import ObjectIdField

class User(Document):
    ROLE_CHOICES = ('student', 'teacher', 'admin')

    username = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)  # store hashed passwords
    role = StringField(choices=ROLE_CHOICES, default='student')
    enrolled_courses = ListField(ReferenceField('Course'))

class Course(Document):
    title = StringField(required=True)
    description = StringField()
    created_by = ReferenceField(User, required=True, reverse_delete_rule=CASCADE)
    created_at = DateTimeField(default=datetime.datetime.utcnow)
    youtube_link = StringField(null=True)
    video_id = ObjectIdField(null=True)  # GridFS video

    def delete(self, *args, **kwargs):
        # Automatically delete enrollments when course is deleted
        from .models import Enrollment  # or adjust import to avoid circular import
        Enrollment.objects(course=self).delete()
        return super().delete(*args, **kwargs)

class Enrollment(Document):
    student = ReferenceField(User, reverse_delete_rule=CASCADE)
    course = ReferenceField(Course, reverse_delete_rule=CASCADE)
    enrolled_at = DateTimeField(default=datetime.datetime.utcnow)

#Done with /register /login /dashboard /upload-course /courses /enroll

class Assignment(Document):
    title = StringField(required=True)
    description = StringField()
    course = ReferenceField(Course, required=True)
    created_by = ReferenceField(User, required=True)
    created_at = DateTimeField(default=datetime.datetime.utcnow)

class Submission(Document):
    assignment = ReferenceField(Assignment, required=True)
    student = ReferenceField(User, required=True)
    content = StringField()  # this could be a text answer or file link
    submitted_at = DateTimeField(default=datetime.datetime.utcnow)

#Done with /upload-assignment /list-assignments /submit-assignment /view-submissions

