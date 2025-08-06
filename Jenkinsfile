pipeline {
    agent any

    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main', credentialsId: 'gittoken', url: 'https://github.com/WebMobi-3/cliniAura-backend-project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'pwd'
                sh 'rm -rf  node_modules'
                sh 'npm install'
            }
        }

        stage('Generate Prisma Client') {
            steps {
                sh 'npx prisma generate'
            }
        }

        stage('Start or Restart Server with PM2') {
            steps {
                script {
                    // Check if app is already running
                    def appRunning = sh(script: "pm2 list | grep 'app.js'", returnStatus: true) == 0

                    if (appRunning) {
                        echo "App is already running. Restarting..."
                        sh 'pm2 restart app.js'
                    } else {
                        echo "App is not running. Starting..."
                        sh 'pm2 start src/app.js'
                    }

                    // Save PM2 process list
                    sh 'pm2 save'
                }
            }
        }
    }
}
