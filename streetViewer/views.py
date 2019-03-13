import base64
import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

globalCounter = 0
pathForImages = "ImagesOfCameras/"
pathForData = 'C:\\Users\\MSI\\PycharmProjects\\bc\\datastorage\\data-standing\\'
fileNamePrefix = 'LidarData_'
fileNameSuffix = '.json'

# Create your views here.def index(request):

# class lidarReader:
#     lidarPoints = [[0 for x in range(360)] for y in range(20)]
#
#
#
#     def __init__(self):
#         self.fillLidarPoints()
#
#     def fillLidarPoints(self):
#         for y in range(0, 20):
#             for x in range(0, 360):
#                 self.lidarPoints[y][x] = x + y * 2

def index(request):
    return render(request,"index.html")

@csrf_exempt
def getImageData(request):
    dictOfImages =json.loads(request.body)
    global globalCounter
    global pathForImages
    for one in dictOfImages:
        filename = pathForImages + one["key"]+ "_take_" + str(globalCounter)+".png"
        imgData = base64.b64decode( one["value"].partition(",")[2])
        with open(filename,'wb') as f:
            f.write(imgData)
    globalCounter+=1
    return JsonResponse({"success":"true"})




@api_view(["GET"])
@csrf_exempt
def dataStored(request, fileId):
    try:
        finalFileName = pathForData + fileNamePrefix + str(fileId) + fileNameSuffix
        with open(finalFileName) as json_file:
            data = json.load(json_file)
            resp = JsonResponse(data, safe=False)
            resp['Access-Control-Allow-Origin'] = '*'
            return resp
    except ValueError as e:
        return Response(e.args[0],status.HTTP_400_BAD_REQUEST)
