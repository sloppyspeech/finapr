import services.FinAprDB as db
import hashlib
import crypt

class FinApr(object):
    def __init__(self, *args, **kwargs):
        self.apt_name="Uber"
        self.finDb=db.FinAprDB('localhost',27017,'finapr')
        self.finDb.connDB()

    def getAllApartments(self):
        return self.finDb.getAllApartments()
    
    def getApartment(self,apartment) :
        print(f'getApartment {apartment}')
        return self.finDb.getApartment(apartment)

    def getApartmentByMobNo(self,mobile_no) :
        print(f'getApartmentByMobNo {mobile_no}')
        return self.finDb.getApartmentByMobNo(mobile_no)

    def getApartmentByApartNo(self,apart_no) :
        print(f'getApartmentByApartNo {apart_no}')
        return self.finDb.getApartmentByApartNo(apart_no)

    def makePayment(self,payment):
        payment['UserId']=int(payment['UserId'])
        return self.finDb.makePayment(payment)

    def getPayment(self,filter):
        return self.finDb.getPayments(filter)
    
    def getPayments(self,request_args):
        valid_keys={'UserId','PaymentDate','PaymentPurpose','Amount','Comment'}
        print(f'FinApr.getPayments {request_args}')
        filter={}
        response={'response':'','status_code':200}
        for k,v in request_args.items():
            print(f'Key {k} : Value {v}')
            if k not in valid_keys:
                response['response']=f'Invalid Key :{k}'
                response['status_code']=400
                return response
            else:
                if k=='Amount':
                    filter[k]=float(v)
                elif k=='UserId':
                    filter[k]=int(v)
                else:
                    filter[k]=v
        response['response']=self.finDb.getPayments(filter)
        response['status_code']=200
        return response


    def registerUser(self,register_params):
        response={}
        print(f'FinApr.registerUser: {register_params}')
        self.password=register_params['Password']
        self.get_hash()
        register_params['Password']=self.hash
        register_params['Salt']=self.salt
        register_params['Active']='Y'
        print(f'Post Hash registerUser: {register_params}')
        response['response']=self.finDb.registerUser(register_params)
        response['status_code']=200
        return response

    def resetPassword(self,register_params):
        response={}
        print(f'FinApr.resetPassword: {register_params}')
        self.password=register_params['Password']
        self.get_hash()
        register_params['Password']=self.hash
        register_params['Salt']=self.salt
        register_params['Active']='Y'
        print(f'Post Hash resetPassword: {register_params}')
        print(f'User id {register_params["UserId"]}')
        response['response']=self.finDb.resetPassword({'UserId':int(register_params['UserId'])},{'$set':{'Password':register_params['Password'],'Salt':register_params['Salt']}})
        print('='*25)
        print(response['response'])
        response['status_code']=200
        return response


    def authUser(self,auth_params):
        print('---------authUser-----------')
        response={}
        print(f'FinApr.authUser: {auth_params}')
        user_dets=self.finDb.getUserDets(auth_params['UserId'])
        print('---------UserDets-------')
        print(user_dets)
        if user_dets != None :
            computed_password=self.get_pass_hash(user_dets['Salt'],auth_params['Password'])
            print('-'*40)
            print(computed_password)
            print(user_dets['Password'])
            print(user_dets['Role'])
            if(computed_password == user_dets['Password']):
                print('let The User IN')
                response['response']='Access Granted'
                response['Role']=user_dets['Role']
                self.updateLoginTime(auth_params)
            else:
                response['response']='Access Denied'
                print('Password is Incorrect')
            print('-'*40)
            print(f'Post FinApr.authUser: {auth_params}')
            response['status_code']=200
        else:
            response['500']=200
            response['response']='Invalid Username/Password'
            response['Role']=None
        return response


    def updateLoginTime(self,login_params):
        print(f'---updateLoginTime----{login_params}')
        return self.finDb.updateLoginTime(login_params)

    def get_hash(self):
        self.salt=crypt.mksalt()
        self.hash=hashlib.pbkdf2_hmac('sha256',bytes(self.password,encoding='UTF-8'),bytes(self.salt,encoding='UTF-8'),10000,64)
        print(f'Salt is {self.salt} Hash is {self.hash}')
        # return [t_salt,t_hash]

    def get_pass_hash(self,salt,password):
        return hashlib.pbkdf2_hmac('sha256',bytes(password,encoding='UTF-8'),bytes(salt,encoding='UTF-8'),10000,64)

    def add_expense(self,expense_params):
        print('---------START add_expense-----------')
        response={}
        print(f'FinApr.add_expense: {expense_params}')
        cre_exp_ret_val=self.finDb.addExpense(expense_params)
        print(cre_exp_ret_val)
        print('---------END add_expense-------')
        return cre_exp_ret_val

    
    def get_all_expenses(self):
        print('----------FinApr get_all_expenses--------')
        all_expenses=self.finDb.getAllExpenses()
        return all_expenses

    def getAptResidentsList(self):
        print('-------getAptResidentsList-------')
        response={}
        apt_res_list=self.finDb.getAptResiList()
        return apt_res_list

    def getSumAllExpByYearMon(self,request_args):
        print('-------getSumAllExpByYearMon-------')
        response={}
        filter={}
        # 
        for k,v in request_args.items():
            print(f'key:{k}   value:{v}')
            filter[k]=v
        print(f'-----getSumAllExpByYearMon----{filter}')
        sum_exp_by_year_mon=self.finDb.getSumAllExpByYearMonth(filter)
        return sum_exp_by_year_mon

    def getSumAllExpByPurpose(self,request_args):
        print('-------getSumAllExpByPurpose-------')
        response={}
        filter={}
        # 
        for k,v in request_args.items():
            print(f'key:{k}   value:{v}')
            filter[k]=v
        print(f'-----getSumAllExpByPurpose----{filter}')
        sum_exp_by_purpose=self.finDb.getSumAllExpByPurpose(filter)
        return sum_exp_by_purpose

    def getAllExpByFilter(self,request_args):
        print('-------finapr.getAllExpByFilter-------')
        response={}
        filter={}

        for k,v in request_args.items():
            print(f'key:{k}   value:{v}')
            filter[k]=v

        exp_by_filter=self.finDb.getAllExpByFilter(filter)
        return exp_by_filter


    def getAllApartExpPurposes(self):
        print('----------FinApr getAllApartExpPurposes--------')
        all_apar_exp_purposes=self.finDb.getAllApartExpPurposes()
        return all_apar_exp_purposes
    

    def getAllPaymentPurposes(self):
        print('----------FinApr getAllPaymentPurposes--------')
        all_payment_purposes=self.finDb.getAllPaymentPurposes()
        return all_payment_purposes

    
    def getSumExpensePaidForApartByYear(self,request_args):
        print('----------FinApr getSumExpensePaidForApartByYear--------')
        filter={}
        for k,v in request_args.items():
            print(f'key:{k}   value:{v}')
            filter[k]=v
        exp_by_apart=self.finDb.getSumExpensePaidForApartByYear(filter)
        return exp_by_apart

    
    def getTotExpenseForApartByYear(self,request_args):
        print('----------FinApr getTotExpenseForApartByYear--------')
        filter={}
        for k,v in request_args.items():
            print(f'key:{k}   value:{v}')
            filter[k]=v
        payment_by_apart=self.finDb.getTotExpenseForApartByYear(filter)
        return payment_by_apart

    def getSumPaymentsMadeByOcuupantsByYear(self,request_args):
        print('----------FinApr getSumPaymentsMadeByOcuupantsByYear--------')
        filter={}
        for k,v in request_args.items():
            print(f'key:{k}   value:{v}')
            filter[k]=v
        exp_by_apart=self.finDb.getSumPaymentsMadeByOcuupantsByYear(filter)
        return exp_by_apart

    
    def getTotPaymentsByOcuupantsByYear(self,request_args):
        print('----------FinApr getTotPaymentsByOcuupantsByYear--------')
        filter={}
        for k,v in request_args.items():
            print(f'key:{k}   value:{v}')
            filter[k]=v
        payment_by_occupant=self.finDb.getTotPaymentsByOcuupantsByYear(filter)
        return payment_by_occupant
    

    def getExpenseIncomeOfApartmentByYear(self,request_args):
        print('----------FinApr getExpenseIncomeOfApartmentByYear--------')
        filter={}
        for k,v in request_args.items():
            print(f'key:{k}   value:{v}')
            filter[k]=v
        expense_income=self.finDb.getExpenseIncomeOfApartmentByYear(filter)
        return expense_income
    

    def add_message(self,message_params):
        print('---------START add_message-----------')
        response={}
        print(f'FinApr.add_message: {message_params}')
        ins_msg_ret_val=self.finDb.insMessage(message_params)
        print(ins_msg_ret_val)
        print('---------END add_message-------')
        return ins_msg_ret_val

    
    def broadcastMessage(self,message_params):
        print('---------START broadcastMessage-----------')
        response={}
        print(f'FinApr.broadcastMessage: {message_params}')
        ins_msg_ret_val=self.finDb.broadcastMessage(message_params)
        print(ins_msg_ret_val)
        print('---------END broadcastMessage-------')
        return ins_msg_ret_val


    def getAllMyMessages(self,request_args):
        print('---------START getAllMyMessages-----------')
        filter={}
        for k,v in request_args.items():
            print(f'key:{k}   value:{v}')
            filter[k]=int(v) #UserId is Number
        all_messages=self.finDb.getAllMyMessages(filter)
        return all_messages
        
    
    def setMessageStatusToRead(self,message_params):
        print(f'---------setMessageStatusToRead-----------')
        print(f'FinApr.setMessageStatusToRead: {message_params}')
        response={}
        upd_msg_status=self.finDb.setMessageStatusToRead(message_params)
        print(upd_msg_status)
        print('---------End setMessageStatusToRead-------')
        return upd_msg_status

