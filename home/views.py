from django.shortcuts import render,HttpResponse,redirect
from django.contrib import messages
from django.contrib.auth import authenticate ,logout
from django.contrib.auth import login as dj_login
from django.contrib.auth.models import User
from .models import Addmoney_info,UserProfile
from django.contrib.sessions.models import Session
from django.core.paginator import Paginator, EmptyPage , PageNotAnInteger
from django.db.models import Sum
import datetime
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import UserProfileSerializer, Addmoney_infoSerializers
from django.http import JsonResponse
from django.core import serializers

# Create your views here.
def home(request):
    if request.session.has_key('is_logged'):
        return redirect('/index')
    return render(request,'home/login.html')

def register(request):
    return render(request,'home/register.html')

def password(request):
    return render(request,'home/password.html')

def index(request):
    if request.session.has_key('is_logged'):
        user_id = request.session['user_id']
        user = User.objects.get(id=user_id)
        addmoney_info = Addmoney_info.objects.filter(user=user).order_by('-Date')
        paginator = Paginator(addmoney_info,4)
        page_number = request.GET.get('page')
        page_obj = Paginator.get_page(paginator,page_number)
        context = {'page_obj' : page_obj}

        return render(request,'home/index.html',context)
    
    return redirect('home')

def addmoney(request):
    return render(request,'home/addmoney.html')

@api_view(['GET'])
def get_expense(request):
    try:
        if request.session.has_key('is_logged'):
            userId = request.session['user_id']
            user = User.objects.get(id=userId)
            
            addmoney_info = Addmoney_info.objects.filter(user=user).order_by('-Date')
            serializer = Addmoney_infoSerializers(addmoney_info,many = True)
            return Response(data=serializer.data,status=200)
    except Exception as e:
        error = str(e)
        return JsonResponse({"error":error},status = 500)


@api_view(['GET'])
def profile(request):
    try:
        if "user_id" in request.session: 
            requestS = request.session['user_id'] 
        else:
            requestS = ""
        return JsonResponse({"req":requestS},status=200)
    except Exception as e:
        error = str(e)
        return JsonResponse({"error":error},status = 500)

def profile_edit(request,id):
    if request.session.has_key('is_logged'):
        add = User.objects.get(id=id)
        return render(request,'home/profile_edit.html',{'add':add})
    return redirect('/home')

def profile_update(request,id):
    if request.session.has_key('is_logged'):
        if request.method == 'POST':
            user = User.objects.get(id=id)
            user.first_name = request.POST["fname"]
            user.last_name = request.POST["lname"]
            user.email = request.POST["email"]
            user.userprofile.Savings = request.POST["Savings"]
            user.userprofile.income = request.POST["income"]
            user.userprofile.profession = request.POST["profession"]

            user.userprofile.save()
            user.save()
            return redirect('/profile')
        
    return redirect('/home')

@api_view(['POST'])
def handleSignup(request):
    try:
        uname = request.data.get("uname")
        fname=request.data.get("fname")
        lname=request.data.get("lname")
        email = request.data.get("email")
        profession = request.data.get("profession")
        Savings = request.data.get("Savings")
        income = request.data.get("income")
        pass1 = request.data.get("pass1")
        pass2 = request.data.get("pass2")
        profile = UserProfile(Savings = Savings,profession=profession,income=income)

        try:
            User.objects.get(username = request.data.get("uname"))
            messages.error(request,"Username already exists")
            return JsonResponse({"msg":'Username already exists'},status=401)

        except User.DoesNotExist:
            if len(uname) > 15:
                messages.error(request," Username must be max 15 characters, Please try again")
                return HttpResponse('Username must be max 15 characters, Please try again')
            if not uname.isalnum():
                messages.error(request,"Usernamee should only contain letters and numbers, Please try again")
                return HttpResponse('Username should only contain letters and numbers, Please try again')
            if pass1 != pass2:
                messages.error(request,"Passwords do not match, Please try again")
                return HttpResponse('Passwords do not match, Please try again')
                
            user = User.objects.create_user(uname,email,pass1)
            user.first_name = fname
            user.last_name = lname
            user.email = email
            user.save()
            profile.user = user
            profile.save()
            messages.success(request,"Your account has been successfully created")
            return HttpResponse('Your account has been successfully created')
    except Exception as e:
        return JsonResponse({"msg":e},status=500)
    return redirect('/login')

@api_view(['POST'])
def handleLogin(request):
    try:
        loginuname = request.data.get("loginuname")
        loginpassword1 = request.data.get("loginpassword1")
        user = authenticate(username = loginuname,password = loginpassword1)
        
        if user is not None:
            dj_login(request,user)
            request.session['is_logged'] = True
            user = request.user.id
            request.session['user_id'] = user
            messages.success(request,"Successfully Logged In")
            request.session.modified = True
            return HttpResponse('Successfully Logged In')
        else:
            response = JsonResponse({"msg":"Invalid Credentials, Please try again" ,"status":False},status=401)
            return response
    except Exception as e:
        return JsonResponse({"msg":e},status=500)

@api_view(["GET"])
def handleLogout(request):
    try:
        del request.session['is_logged']
        del request.session['user_id']
        logout(request)
        messages.success(request,"Successfully Logged Out")
        return JsonResponse({"msg":'Successfully Logged Out'},status=200)
    except Exception as a:
        return JsonResponse({"msg":'Something went wrong'},status=500)


@api_view(['POST'])
def addmoney_submission(request):
    try:
        if request.session.has_key('is_logged'):        
            user_id = request.session['user_id']
            user1 = User.objects.get(id=user_id)
            addmoney_info1 = Addmoney_info.objects.filter(user=user1).order_by('-Date')
            add_money = request.data.get('add_money')
            quantity = request.data.get('quantity')
            Date = request.data.get('Date')
            Category = request.data.get('Category')
            add = Addmoney_info(user = user1,add_money = add_money,quantity = quantity,Date = Date,Category = Category)
            add.save()
            paginator = Paginator(addmoney_info1,4)
            page_number = request.GET.get('page')
            page_obj = Paginator.get_page(paginator,page_number)
            context = {'page_obj' : page_obj}
            return JsonResponse({'msg':"Successfully Submitted"},status = 200)
    except Exception as e:
        error = str(e)
        print(error)
        return JsonResponse({"msg":error},status = 500)

def addmoney_update(request,id):
    if request.session.has_key('is_logged'):
        if request.method == 'POST':
            add = User.objects.get(id=id)
            add.add_money = request.POST["add_money"]
            add.quantity = request.POST["quantity"]
            add.Date = request.POST["Date"]
            add.Category = request.POST["Category"]
            add.save()
            return redirect('/index')
    return redirect('/home')

def expense_edit(request,id):
    if request.session.has_key('is_logged'):
        addmoney_info = Addmoney_info.objects.get(id=id)
        user_id = request.session['user_id']
        user1 = User.objects.get(id=user_id)
        return render(request,'home/expense_edit.html',{'addmoney_info':addmoney_info})
    return redirect('/home')

@api_view(['POST'])
def expense_delete(request,id):
    try:
        if request.session.has_key('is_logged'):
            addmoney_info = Addmoney_info.objects.get(id=id)
            addmoney_info.delete()
        return JsonResponse({'msg':"Successfully Deleted"},status = 200)
    except Exception as e:
        return JsonResponse({"msg":e},status = 500)

def expense_month(request):
    todays_date = datetime.date.today()
    one_month_ago = todays_date-datetime.timedelta(days=30)
    user_id = request.session["user_id"]
    user1 = User.objects.get(id=user_id)
    addmoney = Addmoney_info.objects.filter(user = user1,Date__gte=one_month_ago,Date__lte=todays_date)
    finalrep ={}

    def get_Category(addmoney_info):
        # if addmoney_info.add_money=="Expense":
        return addmoney_info.Category
    Category_list = list(set(map(get_Category,addmoney)))

    def get_expense_category_amount(Category,add_money):
        quantity = 0
        filtered_by_category = addmoney.filter(Category = Category,add_money="Expense")
        for item in filtered_by_category:
            quantity+=item.quantity
        return quantity
    
    for x in addmoney:
        for y in Category_list:
            finalrep[y]= get_expense_category_amount(y,"Expense")
    return Response({'expense_category_data': finalrep}, safe=False)

def stats(request):
    if request.session.has_key('is_logged'):
        todays_date = datetime.date.today()
        one_month_ago = todays_date-datetime.timedelta(days=30)
        user_id = request.session["user_id"]
        user1 = User.objects.get(id=user_id)
        addmoney_info = Addmoney_info.objects.filter(user =
        user1,Date__gte=one_month_ago,Date__lte=todays_date)
        sum = 0
        for i in addmoney_info:
            if i.add_money == 'Expense':
                sum=sum+i.quantity
                addmoney_info.sum = sum
                sum1 = 0
        for i in addmoney_info:
            if i.add_money == 'Income':
                sum1 =sum1+i.quantity
        addmoney_info.sum1 = sum1
        x= user1.userprofile.Savings+addmoney_info.sum1 - addmoney_info.sum
        y= user1.userprofile.Savings+addmoney_info.sum1 - addmoney_info.sum
        if x<0:
            messages.warning(request,'Your expenses exceeded your savings')
            x = 0
        if x>0:
            y = 0
        addmoney_info.x = abs(x)
        addmoney_info.y = abs(y)
        return render(request,'home/stats.html',{'addmoney':addmoney_info})

def expense_week(request):
    todays_date = datetime.date.today()
    one_week_ago = todays_date-datetime.timedelta(days=7)
    user_id = request.session["user_id"]
    user1 = User.objects.get(id=user_id)
    addmoney = Addmoney_info.objects.filter(user =
    user1,Date__gte=one_week_ago,Date__lte=todays_date)
    finalrep ={}
    def get_Category(addmoney_info):
        return addmoney_info.Category
    Category_list = list(set(map(get_Category,addmoney)))
    def get_expense_category_amount(Category,add_money):
        quantity = 0
        filtered_by_category = addmoney.filter(Category =Category,add_money="Expense")
        for item in filtered_by_category:
            quantity+=item.quantity
        return quantity
    for x in addmoney:
        for y in Category_list:
            finalrep[y]= get_expense_category_amount(y,"Expense")
    return Response({'expense_category_data': finalrep}, safe=False)

def weekly(request):
    if request.session.has_key('is_logged') :
        todays_date = datetime.date.today()
        one_week_ago = todays_date-datetime.timedelta(days=7)
        user_id = request.session["user_id"]
        user1 = User.objects.get(id=user_id)
        addmoney_info = Addmoney_info.objects.filter(user =
        user1,Date__gte=one_week_ago,Date__lte=todays_date)
        sum = 0
        for i in addmoney_info:
            if i.add_money == 'Expense':
                sum=sum+i.quantity
        addmoney_info.sum = sum
        sum1 = 0
        for i in addmoney_info:
            if i.add_money == 'Income':
                sum1 =sum1+i.quantity
        addmoney_info.sum1 = sum1
        x= user1.userprofile.Savings+addmoney_info.sum1 - addmoney_info.sum
        y= user1.userprofile.Savings+addmoney_info.sum1 - addmoney_info.sum
        if x<0:
            messages.warning(request,'Your expenses exceeded your savings')
            x = 0
        if x>0:
            y = 0
        addmoney_info.x = abs(x)
        addmoney_info.y = abs(y)
    return render(request,'home/weekly.html',{'addmoney_info':addmoney_info})

def check(request):
    if request.method == 'POST':
        user_exists = User.objects.filter(email=request.POST['email'])
        messages.error(request,"Email not registered, TRY AGAIN!!!")
        return redirect("/reset_password")

def info_year(request):
    todays_date = datetime.date.today()
    one_week_ago = todays_date-datetime.timedelta(days=30*12)
    user_id = request.session["user_id"]
    user1 = User.objects.get(id=user_id)
    addmoney = Addmoney_info.objects.filter(user =
    user1,Date__gte=one_week_ago,Date__lte=todays_date)
    finalrep ={}

    def get_Category(addmoney_info):
        return addmoney_info.Category
    Category_list = list(set(map(get_Category,addmoney)))
    
    def get_expense_category_amount(Category,add_money):
        quantity = 0
        filtered_by_category = addmoney.filter(Category =
        Category,add_money="Expense")
        for item in filtered_by_category:
            quantity+=item.quantity
        return quantity
    for x in addmoney:
        for y in Category_list:
            finalrep[y]= get_expense_category_amount(y,"Expense")
    return Response({'expense_category_data': finalrep}, safe=False)

def info(request):
    return render(request,'home/info.html')

