from flask import Flask
from flask import request,jsonify,make_response,Response
from flask_cors import CORS
from pprint import pprint

from services.FinApr import FinApr

app=Flask(__name__)
CORS(app)

# export FLASK_APP=FinAprEngine.py
# export FLASK_RUN_PORT=9000

@app.route('/',methods=['GET','POST'])
def default_route():
    return jsonify({'response':'FinAprEngine Connection Successful'})


@app.route('/api/v1/apartments',methods=['GET'])
def get_apartments(methods=['GET']):
    findapr=FinApr()
    return findapr.getAllApartments()


@app.route('/api/v1/apartments/apartment/<apart_no>',methods=['GET'])
def get_apartment(apart_no):
    finapr=FinApr()
    return finapr.getApartment(apart_no)


@app.route('/api/v1/apartments/apartment-by-mobno/<mob_no>',methods=['GET'])
def get_apartment_by_mob_no(mob_no):
    finapr=FinApr()
    return finapr.getApartmentByMobNo(mob_no)


@app.route('/api/v1/apartments/apartment-by-apartno/<apart_no>',methods=['GET'])
def get_apartment_by_apart_no(apart_no):
    finapr=FinApr()
    return finapr.getApartmentByApartNo(apart_no)


@app.route('/api/v1/apartments/curr-residents',methods=['GET'])
def get_apartment_curr_residents():
    finapr=FinApr()
    return finapr.getAptResidentsList()


@app.route('/api/v1/payments/pay',methods=['POST'])
def make_payment():
    payment=request.get_json()
    print(f'make_payment :{payment}')
    finapr=FinApr()
    return finapr.makePayment(payment)


@app.route('/api/v1/payments/payment/<filter>',methods=['GET'])
def get_payment(filter):
    print(f'get_payment :{filter}')
    finapr=FinApr()
    # return finapr.get


@app.route('/api/v1/payments',methods=['GET'])
def get_payments():
    finapr=FinApr()
    return finapr.getPayments(request.args)

@app.route('/api/v1/payments/payments-by-mobno',methods=['GET'])
def get_payments_by_mobno():
    print('Inside /api/v1/payments/payments-by-mobno')
    finapr=FinApr()
    return finapr.getPayments(request.args)


@app.route('/api/v1/access/register',methods=['POST'])
def register_user():
    register_params=request.get_json()
    print(f'register_user :{register_params}')
    finapr=FinApr()
    return finapr.registerUser(register_params)


@app.route('/api/v1/access/login',methods=['POST'])
def authenticate_user():
    auth_user_params=request.get_json()
    print(f'authenticate_user :{auth_user_params}')
    finapr=FinApr()
    return finapr.authUser(auth_user_params)
    

@app.route('/api/v1/access/update-login-time',methods=['POST'])
def update_login_date():
    login_params=request.get_json()
    print(f'authenticate_user :{login_params}')
    finapr=FinApr()
    return finapr.updateLoginTime(login_params)
    

@app.route('/api/v1/access/reset-password',methods=['POST'])
def reset_password():
    print('FinApr.reset_password Called')
    reset_params=request.get_json()
    print(f'reset_password :{reset_params}')
    finapr=FinApr()
    return finapr.resetPassword(reset_params)

@app.route('/api/v1/expenses/add-expense',methods=['POST'])
def add_expense():
    print('add_expense')
    expense_params=request.get_json()
    print(f'expense params :{expense_params}')
    finapr=FinApr()
    return finapr.add_expense(expense_params)


@app.route('/api/v1/expenses/all-expenses',methods=['GET'])
def all_expenses():
    print('all_expense')
    finapr=FinApr()
    return finapr.get_all_expenses()


@app.route('/api/v1/expenses/sum-exp-by-year-mon',methods=['GET'])
def sum_exp_by_year_mon():
    print(f'sum_exp_by_year_mon ==>query string {request.args}')
    finapr=FinApr()
    return finapr.getSumAllExpByYearMon(request.args)


@app.route('/api/v1/expenses/sum-exp-by-purpose',methods=['GET'])
def sum_exp_by_purpose():
    print('sum_exp_by_purpose')
    finapr=FinApr()
    return finapr.getSumAllExpByPurpose(request.args)

@app.route('/api/v1/expenses/exp-by-filter',methods=['GET'])
def get_exp_by_filter():
    print('get_exp_by_filter')
    print(f'query string {request.args}')
    finapr=FinApr()
    return finapr.getAllExpByFilter(request.args)


@app.route('/api/v1/master-references/expense-purposes',methods=['GET'])
def get_all_apart_exp_purposes():
    print('get_all_apart_exp_purposes')
    finapr=FinApr()
    return finapr.getAllApartExpPurposes()


@app.route('/api/v1/master-references/payment-purposes',methods=['GET'])
def get_all_payment_purposes():
    print('get_all_payment_purposes')
    finapr=FinApr()
    return finapr.getAllPaymentPurposes()
    

@app.route('/api/v1/expenses/expense-paidby-apartment-by-year',methods=['GET'])
def get_sum_exp_paidby_apartment_by_year():
    print('get_sum_exp_paidby_apartment_by_year')
    print(f'query string {request.args}')
    finapr=FinApr()
    return finapr.getSumExpPaidByApartByYear(request.args)


@app.route('/api/v1/expenses/tot-expense-for-apartment-by-year',methods=['GET'])
def get_tot_expense_paidby_apartment_by_year():
    print('get_tot_expense_paidby_apartment_by_year')
    print(f'query string {request.args}')
    finapr=FinApr()
    return finapr.getTotExpenseForApartByYear(request.args)



@app.route('/api/v1/expenses/payments-by-occupants-by-year',methods=['GET'])
def get_sum_payments_by_occcupants_by_year():
    print('get_sum_payments_by_occcupants_by_year')
    print(f'query string {request.args}')
    finapr=FinApr()
    return finapr.getSumPaymentsMadeByOcuupantsByYear(request.args)


@app.route('/api/v1/expenses/tot-paymentsby-occupants-by-year',methods=['GET'])
def get_tot_payments_paidby_occupants_by_year():
    print('get_tot_payments_paidby_occupants_by_year')
    print(f'query string {request.args}')
    finapr=FinApr()
    return finapr.getTotPaymentsByOcuupantsByYear(request.args)


@app.route('/api/v1/expenses/tot-exp-inc-by-year',methods=['GET'])
def get_tot_exp_inc_by_year():
    print('get_tot_exp_inc_by_year')
    print(f'query string {request.args}')
    finapr=FinApr()
    return finapr.getExpenseIncomeOfApartmentByYear(request.args)


@app.route('/api/v1/messages/message',methods=['POST'])
def add_message():
    print('add_message')
    message_params=request.get_json()
    print(f'expense params :{message_params}')
    finapr=FinApr()
    return finapr.add_message(message_params)

@app.route('/api/v1/messages/broadcast',methods=['POST'])
def broadcast_message():
    print('broadcast_message')
    message_params=request.get_json()
    print(f'expense params :{message_params}')
    finapr=FinApr()
    return finapr.broadcastMessage(message_params)


@app.route('/api/v1/messages/all',methods=['GET'])
def get_all_my_messages():
    print('broadcast_message')
    message_params=request.args
    print(f'expense params :{message_params}')
    finapr=FinApr()
    return finapr.getAllMyMessages(message_params)


@app.route('/api/v1/messages/message-read',methods=['POST'])
def set_message_status_to_read():
    print('set_message_status_to_read')
    message_params=request.get_json()
    print(f'set_message_status_to_read :{message_params}')
    finapr=FinApr()
    return finapr.setMessageStatusToRead(message_params)

if __name__=='__main__':
    app.run(port = '9000')