# Getting It Done :white_check_mark:
### Fullstack to do application

A fullstack CRUD-app with a frontend built using **React** :electron: and **Tailwind** :cyclone:, and a backend using **Firebase :fire:**

#### Features

* Google login using Firebase Auth
* Users can create/delete categories and tasks
* Categories and tasks are saved in Firestore
* Firestore backend is secured by rules, so that users can't change other user's data
* Data is fetched using snapshot listeners, so all changes are synced across all logged in devices

#### Modal warnings are displayed on destructive actions:

![A modal warning message](/readme_assets/modal_warning.png)

#### Completed tasks are optionally displayed below, and minimizing saves that setting for that category:

![Completed tasks minimizable](/readme_assets/completed_tasks.png)
