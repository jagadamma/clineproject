pipeline {
    agent any

    environment {
        LOG_FILE = "${WORKSPACE}/output.log"
        APP_NAME = "cliniAura-app"
        APP_SCRIPT = "src/app.js"
    }

    stages {
        stage('Clean Workspace') {
            steps {
                echo "🧹 Cleaning workspace..."
                cleanWs()
            }
        }

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

        stage('Force Start with PM2') {
            steps {
                echo "🚀 Force starting app with PM2..."
                sh '''
                    echo "🛑 Deleting existing PM2 process (if any)..."
                    pm2 delete "$APP_NAME" || true

                    echo "🚀 Starting app with PM2 (force)..."
                    pm2 start "$APP_SCRIPT" --name "$APP_NAME" -f --output "$LOG_FILE" --error "$LOG_FILE"

                    pm2 save
                    pm2 startup | tail -n 1 | bash || true

                    echo "🌐 Verifying application is up..."
                    sleep 5
                    curl -s http://localhost:3000 || echo "❌ App not reachable yet"
                '''
            }
        }
    }
}
