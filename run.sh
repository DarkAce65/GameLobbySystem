# This script will run the app in development with the correct settings.

if [ ! -f settings.json ]; then
	echo "settings.json not found - run prepDevelopment.sh and fill out keys"
	exit 1
fi

meteor --settings=settings.json