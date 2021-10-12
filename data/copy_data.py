import shutil
import os

if os.path.isdir("data/dev"):
  shutil.rmtree("data/dev")
shutil.copytree("data/prod", "data/dev")

print("Successfully copied data")