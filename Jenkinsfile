pipeline {
    agent any

    environment {
        APP_DIR = "/var/jenkins_home/cliniaura-app"
    }

    stages {
        stage('Checkout Code') {
            steps {
                dir("${APP_DIR}") {
                    git branch: 'main', credentialsId: 'gittoken', url: 'https://github.com/Webmobi360-Development/cliniAura-backend-project.git'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir("${APP_DIR}") {
                    sh 'npm install'
                }
            }
        }

        stage('Start or Restart PM2') {
            steps {
                dir("${APP_DIR}") {
                    script {
                        def isRunning = sh(script: "pm2 list | grep -q 'app.js'", returnStatus: true) == 0
                        if (isRunning) {
                            echo "🔁 Restarting PM2 process..."
                            sh 'pm2 restart app.js'
                        } else {
                            echo "🚀 Starting PM2 process..."
                            sh 'pm2 start src/app.js --name app.js --output output.log --error error.log'
                        }
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
