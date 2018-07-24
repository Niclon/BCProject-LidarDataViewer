from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


# Create your views here.def index(request):

class lidarReader:
    lidarPoints = [[0 for x in range(360)] for y in range(20)]



    def __init__(self):
        self.fillLidarPoints()

    def fillLidarPoints(self):
        for y in range(0, 20):
            for x in range(0, 360):
                self.lidarPoints[y][x] = x + y * 2

def index(request):
    return render(request,"index.html")


@api_view(["GET"])
@csrf_exempt
def DataStored(request):
    try:
        val = lidarReader()
        value = lidarReader.lidarPoints
        resp = JsonResponse(value,safe=False)
        resp['Access-Control-Allow-Origin'] = '*'
        return resp

    except ValueError as e:
        return Response(e.args[0],status.HTTP_400_BAD_REQUEST)
