import FinApr_psgl_db_utils as fputils
from pprint import pprint
from bson.json_util import loads, dumps



class FinAprPSGLDB(object):
    def __init__(self):
        self.psgl=fputils.Finapr_psgl_db_utils('postgres','docker','localhost','5432','finapr')
        

    def psgl_connect(self):
        self.conn=self.psgl.connect()


    def psgl_disconnect(self):
        self.psgl.disconnect()


    def get_all_apartments(self):
        apart_cols=['id','Name','Number','Occupant','MobileNo','active','NoOfOccupants','floor']
        self.psgl_connect()
        cur=self.conn.cursor()
        cur.execute('select id,name,number,occupant,mobile_no,active,no_of_occupants,floor from apartments')
        rows=cur.fetchall()
        results=[]
        for row in rows:
            # print(row)
            results.append(dict(zip(apart_cols,row)))
        pprint(results)
        self.psgl_disconnect()
        return dumps(results)
    
    def get_apartment_by_no(self,apartment_no):
        apart_cols=['id','Name','Number','Occupant','MobileNo','active','NoOfOccupants','floor']
        self.psgl_connect()
        cur=self.conn.cursor()
        cur.execute('select id,name,number,occupant,mobile_no,active,no_of_occupants,floor \
                    from apartments \
                    where number=%s',(apartment_no,))
        rows=cur.fetchall()
        results=[]
        for row in rows:
            # print(row)
            results.append(dict(zip(apart_cols,row)))
        pprint(results)
        self.psgl_disconnect()
        return dumps(results)

    
    def get_apartment_by_mobile_no(self,mobile_no):
        apart_cols=['id','Name','Number','Occupant','MobileNo','active','NoOfOccupants','floor']
        self.psgl_connect()
        cur=self.conn.cursor()
        cur.execute('select id,name,number,occupant,mobile_no,active,no_of_occupants,floor \
                    from apartments \
                    where mobile_no=%s',(mobile_no,))
        rows=cur.fetchall()
        results=[]
        for row in rows:
            # print(row)
            results.append(dict(zip(apart_cols,row)))
        pprint(results)
        self.psgl_disconnect()
        return dumps(results)

    
    def get_apart_resi_list(self):
        return self.get_all_apartments()

    
