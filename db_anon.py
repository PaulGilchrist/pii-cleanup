# pip install Faker --no-warn-script-location
# conda install pyodbc
from faker import Faker
import pyodbc
import random
import time
import db_anon_env as env
fake = Faker()

# Connect to Azure SQL database
def anonymize(server, database, username, password):
    batch_size = 10000
    driver= '/opt/homebrew/lib/libmsodbcsql.18.dylib' # driver= '{ODBC Driver 18 for SQL Server}'
    cnxn = pyodbc.connect(f'DRIVER={driver};SERVER={server};PORT=1433;DATABASE={database};UID={username};PWD={password}')
    start_row = 0
    start_time = time.monotonic()
    cursor = cnxn.cursor()
    while True:
        query = f"""
            SELECT ContactId
            FROM (
                SELECT ContactId, ROW_NUMBER() OVER (ORDER BY ContactId) AS row_num
                FROM shr.Contact
            ) AS t
            WHERE row_num >= {start_row} AND row_num < {start_row + batch_size}
        """
        cursor.execute(query)
        contacts = cursor.fetchall()
        if not contacts:
            break
        for contact in contacts:
            contact_id = contact[0]
            first_name = fake.first_name()
            last_name = fake.last_name()
            company = fake.domain_name()
            email = f'{first_name.lower()}.{last_name.lower()}@{company}'
            street = fake.street_address()
            phone_number = f'({random.randint(100, 999)}) {random.randint(100, 999)}-{random.randint(1000, 9999)}'
            update_query = f"""
                UPDATE Contacts SET FirstName='{first_name}',
                    LastName='{last_name}',
                    DisplayName='{first_name} {last_name}',
                    MailNickName='',
                    Address1Line1='{street}',
                    Address1Line2='',
                    Address1Line3='',
                    Address2Line1='',
                    Address2Line2='',
                    Address2Line3='',
                    Address3Line1='',
                    Address3Line2='',
                    Address3Line3='',
                    EmailAddress1='{email}',
                    EmailAddress2='',
                    EmailAddress3='',
                    PhoneNumber1='{phone_number}',
                    PhoneNumber2='',
                    PhoneNumber3=''
                WHERE ContactID={contact_id}
            """
            # cursor.execute(update_query)
        # cnxn.commit()    
        start_row += batch_size
        print(f'{start_row:,}') # Show progress
    cnxn.close()
    end_time = time.monotonic()
    total_time = end_time - start_time
    print(f'Total time: {total_time:.2f} seconds')

anonymize(env.server, env.database, env.username, env.password)

# # These we don't currently need but may in the future
# city = fake.city()
# zip = fake.postcode()
# state_codes = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN",
#             "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV",
#             "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN",
#             "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
# state = random.choice(state_codes)