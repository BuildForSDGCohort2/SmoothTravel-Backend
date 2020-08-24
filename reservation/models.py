from django.db import models

class Flight(models.Model):
    name = models.CharField(max_length=256)

    def __str__(self):
        return self.name



class Hotel(models.Model):
    name = models.CharField(max_length=256)

    def __str__(self):
        return self.name