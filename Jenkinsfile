pipeline {
    agent any

    environment {
        LOG_FILE = "${WORKSPACE}/output.log"
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

        stage('Restart with PM2') {
            steps {
                echo "🚀 Starting Node.js app with PM2..."
                sh '''
                    if pm2 list | grep -q 'app.js'; then
                        echo "🔁 Restarting existing PM2 process..."
                        pm2 restart src/app.js --output "$LOG_FILE" --error "$LOG_FILE"
                    else
                        echo "🚀 Starting new PM2 process..."
                        pm2 start src/app.js --output "$LOG_FILE" --error "$LOG_FILE"
                    fi

                    pm2 save
                    pm2 startup | tail -n 1 | bash || true

                    sleep 5

                    if curl -s http://localhost:3000 | grep -q '<html>'; then
                        echo "✅ App is running and responding on port 3000"
                    else
                        echo "❌ App is NOT reachable yet"
                    fi
                '''
            }
        }
    }
}
