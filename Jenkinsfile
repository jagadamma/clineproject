pipeline {
    agent any

    environment {
        APP_NAME = "app.js"
        SCRIPT_PATH = "src/app.js"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', 
                    credentialsId: 'gittoken', 
                    url: 'https://github.com/Webmobi360-Development/cliniAura-backend-project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Start or Restart with PM2') {
            steps {
                script {
                    def isRunning = sh(script: "pm2 list | grep -q ${APP_NAME}", returnStatus: true) == 0
                    if (isRunning) {
                        sh "pm2 restart ${APP_NAME}"
                    } else {
                        sh "pm2 start ${SCRIPT_PATH} --name ${APP_NAME}"
                    }
                }
            }
        }

        stage('Save PM2 State') {
            steps {
                sh 'pm2 save'
            }
        }
    }
}
