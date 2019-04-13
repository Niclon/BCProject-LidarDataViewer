import base64
import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

globalCounter = 0
pathForImages = "datastorage/imagesOfCameras/"
pathForData = 'C:\\Users\\MSI\\PycharmProjects\\bc\\datastorage\\data-standing\\'
pathForDataStorage = 'datastorage\\selection\\'
fileNamePrefix = 'LidarData_'
fileNameSuffix = '.json'
fileNameSelectionPrefix = 'Selection_'


def index(request):
    return render(request,"index.html")

@csrf_exempt
def storeImageData(request):
    dictOfImages =json.loads(request.body)
    global globalCounter
    global pathForImages
    for one in dictOfImages:
        filename = pathForImages + one["key"]+ "_take_" + str(globalCounter)+".png"
        imgData = base64.b64decode( one["value"].partition(",")[2])
        with open(filename,'wb') as f:
            f.write(imgData)
    # globalCounter+=1
    return JsonResponse({"success":"true"})


@csrf_exempt
def storeResultData(request):
    data = json.loads(request.body)
    global globalCounter
    global pathForImages
    fileName = pathForDataStorage + fileNameSelectionPrefix + str(globalCounter) + fileNameSuffix
    with open(fileName, 'w') as f:
        f.write(json.dumps(data))
    globalCounter += 1
    return JsonResponse({"success": "true"})



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
