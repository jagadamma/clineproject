pipeline {
    agent any

    environment {
        LOG_FILE = "${WORKSPACE}/output.log"
        APP_NAME = "cliniAura-app"
        PORT = "3000"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                echo "🧹 Cleaning workspace..."
                deleteDir()
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
                echo "📦 Installing npm dependencies..."
                sh 'npm install'
            }
        }

        stage('Install PM2') {
            steps {
                echo "🧰 Installing PM2..."
                sh '''
                    if ! command -v pm2 >/dev/null 2>&1; then
                        npm install -g pm2
                    fi
                '''
            }
        }

        stage('Start App with PM2') {
            steps {
                echo "🚀 Starting Node.js app with PM2..."
                sh '''
                    # Stop and delete if already running
                    if pm2 list | grep -q "$APP_NAME"; then
                        echo "🔁 Restarting existing PM2 process..."
                        pm2 delete "$APP_NAME"
                    fi

                    # Start the app with PM2
                    pm2 start src/app.js --name "$APP_NAME" --output "$LOG_FILE" --error "$LOG_FILE"

                    # Save process list (optional, for restart on reboot)
                    pm2 save

                    sleep 5

                    # Test if app is running
                    curl -s http://localhost:$PORT || echo "⚠️ App not responding yet"
                '''
            }
        }
    }
}
