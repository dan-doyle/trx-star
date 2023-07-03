from csv_to_json import *
from os import listdir
from os.path import isfile, join

# Before running this script make sure you have a "csv" folder and "json" folder
# The "csv" folder should hold your 3 tables ("clip.csv", "exercises.csv" and "video.csv")
# The "json" folder is where the "ExerciseDatabase.json" will be saved after conversion
csvfiles = [f for f in listdir("database_scripts/csv") if isfile(join("database_scripts/csv", f))]
csv_to_json(csvfiles, "ExerciseDatabase.json")
print("Exercise database generated")
