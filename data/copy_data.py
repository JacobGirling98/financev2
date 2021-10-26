import shutil
import os

if os.getcwd()[-7:] == "data":
    root = os.getcwd()[:-4]
else:
    root = os.getcwd()
if os.getenv('API_ENV') == 'prod':
    data_path = f"{root}/data/prod"
else:
    data_path = f"{root}/data/dev"

if os.path.isdir(f"{root}/dev"):
  shutil.rmtree(f"{root}/dev")
shutil.copytree(f"{root}/prod", f"{root}/dev")

print("Successfully copied data")