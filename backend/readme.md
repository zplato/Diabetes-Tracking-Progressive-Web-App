# How to get started with the backend
* Ensure you have Python3 installed
* Clone project with `git clone https://github.com/zplato/CS6440GroupProj.git`
* Run `python3  -m venv venv` to create  virtual environment
* Run `source venv/bin/activate` to activate the environment you just created
* Run `cd backend/src` to navigate to backend source folder
* Run `pip install -r requirements.txt` to install project dependencies
* Run `python app.py` to serve project on your local, you should get your local URL at this point

![CleanShot 2024-10-27 at 21 01 42@2x](https://github.com/user-attachments/assets/d45e8f77-3e6b-4b3a-804f-8b7f85cd6399)
<img width="869" alt="CleanShot 2024-10-27 at 21 03 32@2x" src="https://github.com/user-attachments/assets/f5cbe788-c538-4da3-a28b-34fd700ebc74">


## Connecting to the remote database
Apply your database credentials using your preferred SQL client. If you get the credentials correctly, you should be able to access the database.

<img width="492" alt="CleanShot 2024-10-27 at 21 58 23@2x" src="https://github.com/user-attachments/assets/50ff8c1d-d735-4e87-9f2a-04a1aabd7d2c">
<img width="830" alt="CleanShot 2024-10-27 at 22 00 12@2x" src="https://github.com/user-attachments/assets/0707dae0-a73d-47f1-8e5c-2d80ab204331">

## Managing Credential and Secret Values
For local development we use a .env file to manage credentials. On the live server we set credential values on Render using the Apps environment tab, under Dashboard. We have included a sample `example.env` [file](./example.env), so you can duplicate it to create your `.env` file
