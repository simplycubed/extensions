### Create webhooks in webflow (One time setup)

1. After the extension installation, find the webhook function's trigger url from function details page (Google Console > Functions > ext-webflow-events-storage-webflowHook > Trigger). Trigger url will be in the following format: `https://${location}-${project-id}.cloudfunctions.net/ext-webflow-events-storage-webflowHook`
   You can check if the function is deployed correctly using the health endpoint (Trigger url + `/health`): GET `https://${location}-${project-id}.cloudfunctions.net/ext-webflow-events-storage-webflowHook/health` should return `{"status": "running"}` as response.

2. If an app hasn't been created in webflow, register a new application from workspace settings page (Workspace Settings > Integrations > Workspace Applications)
3. Update the Redirect URI of the app to `auth-success` endpoint (Trigger url mentioned above + `/auth-success`
4. Authorize the webflow app to create webhook endpoints by opening the authorize endpoint (Trigger url + `/authorize`) on a browser. User will be redirected to webflow oauth page and complete the authorization. Once completed, user will be redirected to `/auth-success` and should see the response `{"status": "success"}`.
5. Verify whether webhooks are created for the site from webflow site settings page (Webflow Site Settings > Integrations > Webhooks)
