if [[ $SKIP_POSTINSTALL != "yes" ]]; then
	DIRECTORY=$(pwd)
	cd $DIRECTORY/firestore-webflow-sync/functions && npm install
	cd $DIRECTORY/rtdb-webflow-sync/functions && npm install && cd ..
	cd $DIRECTORY/storage-webflow-sync/functions && npm install && cd ..
	cd $DIRECTORY/webflow-utils && npm install && cd ..
	lerna run --parallel clean && npm run build && npm run generate-package-locks
fi
