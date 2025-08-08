pipeline {
    agent any

    environment {
        APP_DIR = "/home/ec2-user/cliniaura-app"
    }

    stages {
        stage('Clone Repository') {
            steps {
                dir("${APP_DIR}") {
                    git url: 'https://github.com/WebMobi-3/cliniAura-backend-project.git', branch: 'main'
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

        stage('Start App with PM2') {
            steps {
                dir("${APP_DIR}") {
                    // Check if app is already running
                    script {
                        def isRunning = sh(script: "pm2 list | grep app.js", returnStatus: true) == 0
                        if (isRunning) {
                            echo '🔁 Restarting existing PM2 process...'
                            sh 'pm2 restart app.js'
                        } else {
                            echo '🚀 Starting new PM2 process...'
                            sh 'pm2 start src/app.js --name cliniaura --cwd ${APP_DIR} --output output.log --error error.log'
                        }
                        sh 'pm2 save'
                    }
                }
            }
        }
    }
}
