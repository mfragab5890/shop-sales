cd "F:\courses\WebDevelopment FWD\projects\work\shop-sales\backend"
Set-ExecutionPolicy RemoteSigned
echo A
echo starting server...
venv\Scripts\activate
$env:FLASK_APP = 'flaskr'
$env:FLASK_CONFIG = "instance"
$env:FLASK_DEBUG = 'true'
$env:FLASK_ENV = 'development'
Flask run