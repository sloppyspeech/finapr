import psycopg2 as psgl
import json

class Finapr_psgl_db_utils(object):
    def __init__(self,p_user,p_password,p_host,p_port,p_database):
        self.user=p_user
        self.password=p_password
        self.host=p_host
        self.port=p_port
        self.database=p_database
        self.psgl_connection=''
        print(self.user)
        print(self.password)
        print(self.host)
        print(self.port)
        print(self.database)

    def connect(self):
        try:
            self.psgl_connection=psgl.connect(dbname=self.database,user=self.user,
                                        password=self.password,host=self.host,
                                        port=self.port)
            return self.psgl_connection
        except Exception as ex:
            print('Error While Connecting to PSGL DB')
            print(ex)
    

    def disconnect(self):
        self.psgl_connection.close()



