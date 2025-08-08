pipeline {
    agent any

    environment {
        APP_DIR = "/var/jenkins_home/cliniaura-app"
    }

    stages {
        stage('Checkout Code') {
            steps {
                dir("${APP_DIR}") {
                    git branch: 'main', url: 'https://github.com/WebMobi-3/cliniAura-backend-project.git'
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

        stage('Start or Restart with PM2') {
            steps {
                dir("${APP_DIR}") {
                    script {
                        def isRunning = sh(script: "pm2 list | grep -q app.js", returnStatus: true) == 0
                        if (isRunning) {
                            sh 'pm2 restart app.js'
                        } else {
                            sh 'pm2 start src/app.js --name app.js'
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
