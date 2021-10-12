import shutil
import os

if os.getcwd()[-7:] == "backend":
    root = os.getcwd()[:-7]
else:
    root = os.getcwd()
if os.getenv('API_ENV') == 'prod':
    data_path = f"{root}/prod"
else:
    data_path = f"{root}/dev"

if os.path.isdir(f"{root}/dev"):
  shutil.rmtree(f"{root}/dev")
shutil.copytree(f"{root}/prod", f"{root}/dev")

print("Successfully copied data")