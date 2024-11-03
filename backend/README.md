# Production Backend URL
https://cs6440groupproj.onrender.com

## How to get started with the backend
* Ensure you have Python3 installed
* Clone project with `git clone https://github.com/zplato/CS6440GroupProj.git`
* Run `python3  -m venv venv` to create  virtual environment
* Run `source venv/bin/activate` to activate the environment you just created
* Run `cd backend/src` to navigate to backend source folder
* Run `pip install -r requirements.txt` to install project dependencies
* Run `python app.py` to serve project on your local, you should get your local URL at this point

![CleanShot 2024-10-27 at 21 01 42@2x](https://github.com/user-attachments/assets/d45e8f77-3e6b-4b3a-804f-8b7f85cd6399)
<img width="869" alt="CleanShot 2024-10-27 at 21 03 32@2x" src="https://github.com/user-attachments/assets/f5cbe788-c538-4da3-a28b-34fd700ebc74">


### Connecting to the Remote Database
Apply your database credentials using your preferred SQL client. If you get the credentials correctly, you should be able to access the database.

<img width="492" alt="CleanShot 2024-10-27 at 21 58 23@2x" src="https://github.com/user-attachments/assets/50ff8c1d-d735-4e87-9f2a-04a1aabd7d2c">
<img width="830" alt="CleanShot 2024-10-27 at 22 00 12@2x" src="https://github.com/user-attachments/assets/0707dae0-a73d-47f1-8e5c-2d80ab204331">

### Remote Database Initialization
**Loading Environment Variables**: The `load_dotenv()` function loads the environment variables from the .env file located in the src directory.

**Configuring SQLAlchemy**: The `SQLALCHEMY_DATABASE_URI` is constructed using the loaded environment variables. This URI specifies the database driver, username, password, host, and database name.

**Connection Check**: The `check_connection()` function attempts to connect to the database. If successful, it prints a confirmation message to the console. If it fails, an error message is displayed.

## Managing Environment Variables and Secrets
**Production/Deployed Instance** - On the live server the database connection variables, including secrets are stored as environmental variables on Render using the Apps environment tab, under Dashboard. 

**Local Development** - Utilize your own .env file under `/backend` path. There is an included a sample `example.env` [file](./example.env), so you can duplicate it to create your `.env` file. 

## Application Program Interface (API)
The following Endpoints are configured along with a basic description of their functionality:

* **Home Endpoint** 
  * URL: `/`
  * Method: `GET`
  * Description: A simple home route that returns a welcome message for the project
* **Validate User Login** 
  * URL: `/validateUserLogin`
  * Method: `POST`
  * Description: This endpoint validates user login credentials. It checks if the provided username and password match any entry in the database.
* **Test Environment**
  * URL: `/testEnv`
  * Description: This endpoint returns a safe subset of environment variables, which helps in confirming the environment configuration without exposing sensitive information like passwords.
### Blood Glucose and Insulin Entries
* **List All Entries** 
  * URL: `/entries`
  * Method: `GET`
  * Query Parameters:
    * `account_id` (optional): Filter entries by account ID URL: `/entries?account_id=<account_id>`
  * Description: Retrieves all blood glucose and insulin entries

* **Get Single Entry** 
  * URL: `/entries/<entry_id>`
  * Method: `GET`
  * Description: Retrieves a specific entry by ID

* **Create Entry** 
  * URL: `/entries`
  * Method: `POST`
  * Description: Creates a new blood glucose/insulin entry
  * Request Body:
    ```json
    {
      "account_id": "integer",
      "bg_morning": "decimal(optional)",
      "bg_afternoon": "decimal(optional)",
      "bg_evening": "decimal(optional)",
      "ins_morning": "decimal(optional)",
      "ins_afternoon": "decimal(optional)",
      "ins_evening": "decimal(optional)"
    }
    ```

* **Update Entry** 
  * URL: `/entries/<entry_id>`
  * Method: `PUT`
  * Description: Updates an existing entry
  * Request Body: Same as Create Entry (all fields optional)

* **Delete Entry** 
  * URL: `/entries/<entry_id>`
  * Method: `DELETE`
  * Description: Deletes an existing entry
