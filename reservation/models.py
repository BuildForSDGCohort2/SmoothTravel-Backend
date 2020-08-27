from django.db import models

class Flight(models.Model):
    ''' Flight booking model'''
    name = models.CharField(max_length=256)

    def __str__(self):
        return self.name



class Hotel(models.Model):
    ''' Hotel booking model'''
    name = models.CharField(max_length=256)

    def __str__(self):
        return self.name