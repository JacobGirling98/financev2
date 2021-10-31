import shutil
import os

print(os.getcwd())

if os.getcwd()[-7:] == "data":
    root = os.getcwd()[:-4]
else:
    root = os.getcwd()
if os.getenv('API_ENV') == 'prod':
    data_path = f"{root}/data/prod"
else:
    data_path = f"{root}/data/dev"

if os.path.isdir(f"{root}/data/dev"):
  shutil.rmtree(f"{root}/data/dev")
shutil.copytree(f"{root}/data/prod", f"{root}/data/dev")

print("Successfully copied data")