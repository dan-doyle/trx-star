import csv
import json
import os

# This function converts all the csv tables in the "csv" folder to an "ExerciseDatabase.json"
def csv_to_json(csv_files, json_file):
    
    table_structure =[]
    
    # Search for csv in csv folder
    for csv_file in csv_files:
        table_name = os.path.splitext(csv_file)
        
        with open("database_scripts/csv/" + csv_file, 'rb') as f:
            contents = f.read().decode('utf-8-sig')
            f = contents.splitlines()
            reader = csv.reader(f)
            header = next(reader)
            rows = list(reader)
            
            keyPath = header[0]
            
        indexes = []

        # Convert into desired structure    
        for h in header:
            if h == keyPath:
                continue
            #Muscle type is multientry
            if h == "muscle_type":
                indexes.append({
                "name": h,
                "keyPath": h,
                "unique": False,
                "multientry": True
                })

            else:
                indexes.append({
                    "name": h,
                    "keyPath": h,
                    "unique": False,
                    "multientry": False
                    })
                    
        data = []
        # Append the data
        for row in rows:
            item = {}
            for i, h in enumerate(header):
                if (row[i].isdigit()):
                    item[h] = int(row[i])
                elif(h == 'muscle_type'):
                    lst = row[i].split(',')
                    item[h] = lst
                else:
                    item[h] = row[i]
            data.append(item)
                    
                    
        structure = {
            "name": table_name[0],
            "keyPath": keyPath,
            "indexes": indexes,
            "data": data
            }

        table_structure.append(structure)

    #Define the schema structure and name of the database
    schema_structure = {
        "name": "ExerciseDatabase",
        "version": 1,
        "tables": table_structure
    }

    #Save to json
    with open("database_scripts/json/" + json_file, 'w') as f:
        json.dump(schema_structure, f, indent=2,
                  separators=(',', ': '), sort_keys=False)

