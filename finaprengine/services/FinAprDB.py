from pymongo import MongoClient
from pprint import pprint
from bson.json_util import loads, dumps
from bson.objectid import ObjectId
import json


class FinAprDB(object):
    """[summary]

    Arguments:
        object {[type]} -- [description]
    """

    def __init__(self, host, port, dbname):
        self.host = host
        self.port = port
        self.dbname = dbname

    def connDB(self):
        """[summary]
        """
        mongo_cli = MongoClient(self.host, self.port)
        self.dbconn = mongo_cli[self.dbname]

    def getAllApartments(self):
        """[summary]

        Returns:
            [type] -- [description]
        """
        apartments = []
        for apartment in self.dbconn['Apartments'].find():
            print(apartment)
            apartments.append(apartment)
        print('*'*80)
        pprint(apartments)
        return dumps(apartments)

    def getApartment(self, p_apartment):
        print(p_apartment)
        apartment = (self.dbconn['Apartments'].find_one(
            {'Number': p_apartment}))
        pprint(apartment)
        apartment['StartDate'] = apartment['StartDate'].strftime("%d-%b-%Y")
        return dumps(apartment)

    def getApartmentByMobNo(self, p_mob_no):
        print(p_mob_no)
        apartment = self.dbconn['Apartments'].find_one(
            {'MobileNo': int(p_mob_no)})
        print(f'apartment  {apartment}')
        pprint(apartment)
        apartment['StartDate'] = apartment['StartDate'].strftime("%d-%b-%Y")
        return dumps(apartment)

    def getApartmentByApartNo(self, p_apart_no):
        print(f'getApartmentByApartNo {p_apart_no}')
        apartment = self.dbconn['Apartments'].find_one({'Number': p_apart_no})
        print(f'apartment  {apartment}')
        pprint(apartment)
        apartment['StartDate'] = apartment['StartDate'].strftime("%d-%b-%Y")
        return dumps(apartment)

    def getAptResiList(self):
        ret_val = {'requestStatus': 'Success', 'Document': ''}
        print(f'FinAprDB.getAptResiList')
        apt_resi_list = []

        try:
            db_ret_val = self.dbconn['Apartments'].find(
                {'Active': 'Y'}).sort('Floor')
            pprint(db_ret_val)
            for resident in db_ret_val:
                pprint(resident)
                if resident['Number'] != "0":
                    apt_resi_list.append(resident)
            print('-------------------------')
            pprint(apt_resi_list)
        except Exception as ex:
            ret_val = {'requestStatus': 'Error', 'Document': str(ex)}
        return dumps(apt_resi_list)

    def getResidentsByStatus(self, p_active='Y'):
        return self.dbconn['Apartments'].find({'Active': p_active})

    def getPayments(self, filter):
        payments = []
        dbPayments = None
        print(f'FinAprDB.getAllPayments filter {filter}')
        if filter == None:
            dbPayments = self.dbconn['Payments'].find().sort('PaymentDate', -1)
        else:
            dbPayments = self.dbconn['Payments'].find(
                filter).sort('PaymentDate', -1)

        for payment in dbPayments:
            print(payment['PaymentDate'])
            payments.append(payment)
        pprint(payments)
        return dumps(payments)

    # def getTotPaymentByApartment(self):

    def makePayment(self, payment):
        ret_val = {'requestStatus': 'Success', 'Document': payment}
        print(f'FinAprDB.makePayment :{payment}')
        try:
            self.dbconn['Payments'].insert_one(payment)
        except Exception as ex:
            ret_val = {'requestStatus': 'Error', 'Document': str(ex)}
        return dumps(ret_val)

    def getPayment(self, filter):
        print(filter)
        payment = (self.dbconn['Payments'].find_one({filter}))
        pprint(payment)
        # payment['StartDate']=payment['StartDate'].strftime("%d-%b-%Y")
        return dumps(payment)


    def registerUser(self, user_doc):
        ret_val = {'requestStatus': 'Success', 'Document': user_doc}
        print(f'FinAprDB.registerUser user_doc{user_doc}')
        try:
            user_doc['UserId'] = int(user_doc['UserId'])
            self.dbconn['Users'].insert_one(user_doc)
            db_ret_val = self.dbconn['Apartments'].update_one(
                {"Number": user_doc['ApartmentNo']}, {"$set": {"Occupant": user_doc["UserName"],"Active":"Y","MobileNo":int(user_doc['UserId'])}})
        except Exception as ex:
            ret_val = {'requestStatus': 'Error', 'Document': str(ex)}
        return dumps(ret_val)


    def getUserDets(self, user_id):
        print('-----------getUserSalt-------------')
        print(f'user_id {user_id} {type(user_id)}')
        t_salt = self.dbconn['Users'].find_one({'UserId': int(user_id)})
        print(t_salt)
        return t_salt


    def updateLoginTime(self,login_params):
        print(f'---------updateLoginTime---------{login_params}')
        user_id=login_params['UserId']
        login_date=login_params['LoginDate']
        print(f'user_id :{user_id}  login_date :{login_date}')
        try:
            upd_login_ret_val = self.dbconn['Users'].update_one(
                    {"UserId": user_id}, {"$set": {"LoginDate":login_date }})
            print('Updating multiple documents **************************')
            # upd_messages_ret_val=self.dbconn['Messages'].updateMany(
            #         {"RecipientMobileNo": user_id}, {"$set": {"RecipientLoginDate":login_date }})
    
            ret_val={'response':'Success','Message':'Login Time Update Successful'}
        except Exception as ex:
            ret_val={'response':'Error','Message':str(ex)}
        return ret_val

        


    def resetPassword(self, conditions, update_fields):
        ret_val = {'requestStatus': 'Success', 'Document': {
            'condition': conditions, 'fields': update_fields}}
        print(f'FinAprDB.resetPassword user_doc :{conditions,update_fields}')
        try:
            db_ret_val = self.dbconn['Users'].update_one(
                conditions, update_fields)
            print(db_ret_val.raw_result)
            ret_val['dbRetVal'] = db_ret_val.raw_result
            if db_ret_val.raw_result['nModified'] == 0:
                ret_val['requestStatus'] = 'Error:User Does Not Exist'
        except Exception as ex:
            ret_val = {'requestStatus': 'Error', 'Document': str(ex)}
        return dumps(ret_val)

    def addExpense(self, expense_doc):
        ret_val = {'requestStatus': 'Error', 'Document': expense_doc}
        print(f'FinAprDB.addExpense expense_doc :{expense_doc}')
        try:
            db_ret_val = self.dbconn['ApartmentExpenses'].insert_one(
                expense_doc)
            print(f'acknowledged : {db_ret_val.acknowledged}')
            print(f'inserted_id : {db_ret_val.inserted_id}')
            if db_ret_val.acknowledged:
                ret_val = {'requestStatus': 'Success', 'Document': expense_doc}
                print(ret_val)
        except Exception as ex:
            ret_val = {'requestStatus': 'Error', 'Document': str(ex)}
            print(f'add_expense Error :{dumps(ret_val)}')
        return dumps(ret_val)

    def getAllExpenses(self):
        query = [
            {
                "$project": {
                    "ApartmentExpenses": "$$ROOT"
                }
            },
            {
                "$lookup": {
                    "localField": "ApartmentExpenses.PaidByUserId",
                    "from": "Apartments",
                    "foreignField": "MobileNo",
                    "as": "Apartment"
                }
            },
            {
                "$match": {
                    "Apartment.Active": "Y"
                }
            },
            {
                "$sort": {
                    "ApartmentExpenses.Date": -1
                }
            }
        ]
        apartments = []
        print('Getting Apartments in FinAprDB.getAllExpenses')
        for apartment in self.dbconn['ApartmentExpenses'].aggregate(query):
            pprint(apartment)
            apartments.append(apartment)

        return dumps(apartments)

    def getSumAllExpByYearMonth(self,filter):
        print(f'----------FinAprDB.getSumAllExpByYearMonth------{filter}------')
        ret_val = {'requestStatus': 'Success', 'Document': ''}
        input = [
            {
                "$match": {
                    "$and": [
                        {
                            "Date": {
                                "$gte": filter['startDate']
                            }
                        },
                        {
                            "Date": {
                                "$lte": filter['endDate']
                            }
                        }
                    ]
                }
            },
             {
                "$group": {
                    "_id": {
                        "$substr": ["$Date", 0, 7]
                    },
                    "SUM(Amount)": {
                        "$sum": "$Amount"
                    }
                }
            },
            {
                "$project": {
                    "Month": "$_id",
                    "SUM(Amount)": "$SUM(Amount)"
                }
            },
            {
                "$sort": {
                    "Month": 1
                }
            }
        ]
        data = []
        try:
            for row in self.dbconn['ApartmentExpenses'].aggregate(input):
                pprint(row)
                data.append(row)
        except Exception as ex:
            ret_val = {'requestStatus': 'Error', 'Document': str(ex)}
        print('----getSumAllExpByYearMon----')
        pprint(data)
        print('-------------------------------------')
        return dumps(data)

    def getSumAllExpByPurpose(self,filter):
        print(f'----------FinAprDB.getSumAllExpByPurpose------{filter}------')
        ret_val = {'requestStatus': 'Success', 'Document': ''}
        input = [
            {
                "$match": {
                    "$and": [
                        {
                            "Date": {
                                "$gte": filter['startDate']
                            }
                        },
                        {
                            "Date": {
                                "$lte": filter['endDate']
                            }
                        }
                    ]
                }
            },
            {
                "$group": {
                    "_id": "$Purpose",
                    "SUM(Amount)": {
                        "$sum": "$Amount"
                    }
                }
            },
            {
                "$project": {
                    "Purpose": "$_id",
                    "SUM(Amount)": "$SUM(Amount)"
                }
            },
            {
                "$sort": {
                    "SUM(Amount)": -1
                }
            }
        ]
        data = []
        try:
            for row in self.dbconn['ApartmentExpenses'].aggregate(input):
                pprint(row)
                data.append(row)
        except Exception as ex:
            ret_val = {'requestStatus': 'Error', 'Document': str(ex)}
        return dumps(data)

    def getAllExpByFilter(self, filter):
        print('----------finDB.getAllExpByFilter------------')
        print(filter)
        ret_val = {'requestStatus': 'Success', 'Document': ''}

        input = [
            {
                "$project": {
                    "_id": "ExpFiltQuery",
                    "ApartmentExpenses": "$$ROOT"
                }
            },
            {
                "$lookup": {
                    "localField": "ApartmentExpenses.PaidByUserId",
                    "from": "Apartments",
                    "foreignField": "MobileNo",
                    "as": "ExpenseDetails"
                }
            },
            {
                "$match": {
                    "$and": [
                        {
                            "ApartmentExpenses.Date": {
                                "$gt": filter['startDate']
                            }
                        },
                        {
                            "ApartmentExpenses.Date": {
                                "$lt": filter['endDate']
                            }
                        },
                        {
                            "ApartmentExpenses."+filter['srchField']: {'$regex': f"^.*{filter['srchValue']}.*$", '$options': 'i'}
                        }
                    ]
                }
            },
            {
                "$sort": {
                    "ApartmentExpenses.Date": -1
                }
            }
        ]

        print('='*80)
        pprint(input)
        print('='*80)

        data = []
        try:
            for row in self.dbconn['ApartmentExpenses'].aggregate(input):
                pprint(row)
                data.append(row)
        except Exception as ex:
            ret_val = {'requestStatus': 'Error', 'Document': str(ex)}
        return dumps(data)

    def getAllApartExpPurposes(self):
        apartExpPurposes = []
        purpose = None
        print(f'FinAprDB.getAllApartExpPurposes')
        purposes = self.dbconn['MasterReference'].find(
            {'ApartmentExpPurpose': {'$exists': True}})

        for purpose in purposes:
            pprint(purpose)
            purpose['ApartmentExpPurpose'] = sorted(
                purpose['ApartmentExpPurpose'])
            apartExpPurposes.append(purpose)
        pprint(apartExpPurposes)
        return dumps(apartExpPurposes)


    def getAllPaymentPurposes(self):
        paymentPurposes = []
        purpose = None
        print(f'FinAprDB.getAllPaymentPurposes')
        purposes = self.dbconn['MasterReference'].find(
            {'PaymentPurpose': {'$exists': True}})

        for purpose in purposes:
            pprint(purpose)
            purpose['PaymentPurpose'] = sorted(purpose['PaymentPurpose'])
            pprint(purpose)
            paymentPurposes.append(purpose)
        pprint(paymentPurposes)
        return dumps(paymentPurposes)

    def getSumPaymentsMadeByOccupantsByYear(self, filter):
        print('-------getSumPaymentsMadeByOcuupantsByYear-------')
        print(filter)
        ret_val = {}
        data = []
        pipeline = [
            {
                u"$project": {
                    u"_id": 0,
                    u"Payments": u"$$ROOT"
                }
            },
            {
                u"$lookup": {
                    u"localField": u"Payments.UserId",
                    u"from": u"Apartments",
                    u"foreignField": u"MobileNo",
                    u"as": u"Apartments"
                }
            },
            {
                u"$unwind": {
                    u"path": u"$Apartments",
                    u"preserveNullAndEmptyArrays": False
                }
            },
            {
                u"$match": {
                    u"$and": [
                        {
                            u"Payments.PaymentDate": {
                                u"$gte": filter['startDate']
                            }
                        },
                        {
                            u"Payments.PaymentDate": {
                                u"$lte": filter['endDate']
                            }
                        }
                    ]
                }
            },
            {
                u"$group": {
                    u"_id": {
                        u"Apartments\u1390Number": u"$Apartments.Number"
                    },
                    u"SUM(Payments\u1390Amount)": {
                        u"$sum": u"$Payments.Amount"
                    }
                }
            },
            {
                u"$project": {
                    u"TotalAmountPaid": u"$SUM(Payments\u1390Amount)",
                    u"ApartmentNumber": u"$_id.Apartments\u1390Number",
                    u"_id": 0
                }
            }
        ]
        pprint(pipeline)
        try:
            for doc in self.dbconn['Payments'].aggregate(pipeline):
                pprint(doc)
                data.append(doc)
        except Exception as ex:
            ret_val = {'requestStatus': 'Error', 'Document': str(ex)}
            print(ret_val)
        return dumps(data)

    def getSumExpensePaidForApartByYear(self, filter):
        """Expense Paid By Apartment Administrator in a time span. They are tracked by
           who paid them.

        Arguments:
            filter {startDate:,endDate,}: date range to query for expenses

        Returns:
            [{'AparmentNumber':'G-1','TotalExpense':43434},..]
        """

        print('-------getSumExpensePaidForApartByYear-------')
        print(filter)
        ret_val = {}
        data = []
        pipeline = [
            {
                u"$project": {
                    u"_id": 0,
                    u"ApartmentExpenses": u"$$ROOT"
                }
            },
            {
                u"$lookup": {
                    u"localField": u"ApartmentExpenses.PaidByUserId",
                    u"from": u"Apartments",
                    u"foreignField": u"MobileNo",
                    u"as": u"Apartments"
                }
            },
            {
                u"$unwind": {
                    u"path": u"$Apartments",
                    u"preserveNullAndEmptyArrays": False
                }
            },
            {
                u"$match": {
                    u"$and": [
                        {
                            u"ApartmentExpenses.Date": {
                                u"$gte": filter['startDate']
                            }
                        },
                        {
                            u"ApartmentExpenses.Date": {
                                u"$lte": filter['endDate']
                            }
                        }
                    ]
                }
            },
            {
                u"$group": {
                    u"_id": {
                        u"Apartments\u1390Number": u"$Apartments.Number"
                    },
                    u"SUM(ApartmentExpenses\u1390Amount)": {
                        u"$sum": u"$ApartmentExpenses.Amount"
                    }
                }
            },
            {
                u"$project": {
                    u"TotalExpense": u"$SUM(ApartmentExpenses\u1390Amount)",
                    u"ApartmentNumber": u"$_id.Apartments\u1390Number",
                    u"_id": 0
                }
            }
        ]

        pprint(pipeline)
        try:
            for doc in self.dbconn['ApartmentExpenses'].aggregate(pipeline):
                pprint(doc)
                data.append(doc)
        except Exception as ex:
            ret_val = {'requestStatus': 'Error', 'Document': str(ex)}
            print(ret_val)
        return dumps(data)

    def getTotExpenseForApartByYear(self, filter):
        print(f'----getTotExpenseForApartByYear---{filter}')
        sum_pay_by_apt = eval(self.getSumExpensePaidForApartByYear(filter))
        print('========================')
        print(sum_pay_by_apt)
        total = 0
        for i in range(0, len(sum_pay_by_apt)):
            print(sum_pay_by_apt[i])
            total += sum_pay_by_apt[i]['TotalExpense']
        print(total)
        return dumps({'TotalApartmentExpense': total})

    def getTotPaymentsByOcuupantsByYear(self, filter):
        print(f'----getTotPaymentsByOcuupantsByYear---{filter}')
        sum_pay_by_occupants = eval(
            self.getSumPaymentsMadeByOccupantsByYear(filter))
        print('========================')
        print(sum_pay_by_occupants)
        total = 0
        for i in range(0, len(sum_pay_by_occupants)):
            print(sum_pay_by_occupants[i])
            total += sum_pay_by_occupants[i]['TotalAmountPaid']
        print(total)
        return dumps({'TotalPaymentByOccupants': total})

    
    def getExpenseIncomeOfApartmentByYear(self,filter):
        print('-------getExpenseIncomeOfApartmentByYear--------')
        ret_val=[]
        ret_val.append(eval(self.getTotPaymentsByOcuupantsByYear(filter)))
        ret_val.append(eval(self.getTotExpenseForApartByYear(filter)))
        pprint(ret_val)
        return dumps(ret_val)


    def insMessage(self,message):
        try:
            msg={
                "RecipientMobileNo": message['RecipientMobileNo'], #9999999991,
                "RecipientName": message['RecipientName'], #"Mr. Subramaniam Swamy",
                "RecipientApartment":message['RecipientApartment'],   #"B-1",
                "Date":message['Date']    ,#"2019-10-10",
                "Message":message['Message'],    #"Your Maintenance is pending",
                "Read":message['Read']   #"N"
                }
        except Exception as ex:
            return dumps({'returnStatus':'Error in Msg Input String','Message':str(ex)})
        print('Input Message ')
        print('=====================================')
        pprint(msg)
        print('=====================================')
        try:
            db_ret_val=self.dbconn['Messages'].insert_one(msg)
            print(f'acknowledged : {db_ret_val.acknowledged}')
            print(f'inserted_id : {db_ret_val.inserted_id}')
            return dumps( {'returnStatus':'Success','Message':{db_ret_val.acknowledged}})
        except Exception as ex:
            return dumps({'returnStatus':'Error While Inserting Message','Message':str(ex)})
            


    def broadcastMessage(self,message):
        ret_val={'reponse':'unknown'}
        print('='*80)
        print('----broadcastMessage-----')
        #get All residents except the admin account.
        for rec in self.dbconn['Apartments'].find({"$and" :[{"MobileNo":{"$ne":9999999999},"Active":{"$eq":"Y"}}]}):
            msg={
                "RecipientMobileNo": rec['MobileNo'], #9999999991,
                "RecipientName": rec['Occupant'], #"Mr. Subramaniam Swamy",
                "RecipientApartment":rec['Number'],   #"B-1",
                "Date":message['Date']    ,#"2019-10-10",
                "Message":message['Message'],    #"Your Maintenance is pending",
                "Read":message['Read']  
            }
            pprint(msg)
            ret_val=self.insMessage(msg)
            pprint(ret_val)
        print('='*80)
        return dumps({'response':'warning','Message':str(ret_val)})

    
    def getAllMyMessages(self,filter):
        print('-'*80)
        print(f'--getAllMyMessages---{filter}')
        
        messages = []
        print('Getting All Messages in FinAprDB.getAllMyMessages')
        for message in self.dbconn['Messages'].find({"RecipientMobileNo":filter['UserId']}).sort('Date', -1):
            pprint(message)
            messages.append(message)
        return dumps(messages)
        

    def setMessageStatusToRead(self,filter):
        print('-'*80)
        print(f'----setMessageStatusToRead----{filter}')
        retval={'requestStatus':'','Message':''}
        try:
                        # {'RecipientMobileNo':int(filter['UserId'])},
            upd_status=self.dbconn['Messages'] \
                        .update_many(
                        {"$and" :[{'RecipientMobileNo':{'$eq':int(filter['UserId'])},'Read':{'$eq':'N'}}]},
                        {"$set":{'Read':'Y'}},
                        False
                        )
            print(upd_status.matched_count)
            print(upd_status.modified_count)
            retval['requestStatus']='Success'
            retval['Message']=f'{upd_status.matched_count}: Matched And {upd_status.modified_count}: Updated Successfully'
        except Exception as ex:
            retval['requestStatus']='Error'
            retval['Message']=str(ex)
        return retval
