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

        stage('Start/Restart PM2 Process') {
            steps {
                echo "🚀 Starting or Restarting PM2..."
                sh '''
                    # Check if PM2 process exists
                    if pm2 describe "$APP_NAME" > /dev/null; then
                        echo "🔁 PM2 process '$APP_NAME' found. Restarting..."
                        pm2 restart "$APP_NAME"
                    else
                        echo "🚀 PM2 process '$APP_NAME' not found. Starting new..."
                        pm2 start "$APP_SCRIPT" --name "$APP_NAME" --output "$LOG_FILE" --error "$LOG_FILE"
                    fi

                    # Save and ensure startup on reboot
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
