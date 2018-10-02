"""bc URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import include

from streetViewer import views
from streetViewer.views import *

#url(r'^', TemplateView.as_view(template_name="index.html")),

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    # url(r'^dataStored/',dataStored),
    url(r'^api-auth/', include('rest_framework.urls')),

    url(r'^datastored',views.DataStored),
    url(r'^Images/$',views.getImageData, name='Images'),
    url(r'^',index),


]