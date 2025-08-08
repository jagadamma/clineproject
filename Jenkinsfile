pipeline {
    agent any

    environment {
        LOG_FILE = "${WORKSPACE}/output.log"
        APP_NAME = "cliniAura-app"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "📥 Checking out code..."
                git branch: 'main', credentialsId: 'gittoken', url: 'https://github.com/Webmobi360-Development/cliniAura-backend-project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "📦 Installing dependencies..."
                sh 'npm install'
            }
        }

        stage('Restart with PM2') {
            steps {
                echo "🚀 Starting Node.js app with PM2..."
                sh '''
                    pm2 delete ${APP_NAME} || true
                    pm2 start "${WORKSPACE}/src/app.js" --name ${APP_NAME} --output ${LOG_FILE} --error ${LOG_FILE}
                    pm2 save
                    sleep 5
                    curl -s http://localhost:3000 || echo "App not reachable yet"
                '''
            }
        }
    }
}
