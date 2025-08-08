pipeline {
    agent any

    environment {
        LOG_FILE = "${WORKSPACE}/output.log"
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

        stage('Restart Node App in Background') {
            steps {
                echo "🚀 Restarting Node app..."
                sh '''
                    set -euo pipefail

                    echo "🔍 Checking for existing process on port $PORT..."
                    PID=$(lsof -ti tcp:$PORT || true)
                    
                    if [ -n "$PID" ]; then
                        echo "❌ Killing old process on port $PORT (PID=$PID)..."
                        kill -9 $PID || true
                    fi

                    echo "🗑️ Cleaning up old log file..."
                    rm -f "$LOG_FILE"

                    echo "🚀 Starting Node app in background..."
                    node src/app.js
                    // node src/app.js > "$LOG_FILE" 2>&1 &

                    echo "⏳ Waiting for app to start..."
                    sleep 5

                    echo "📡 Checking app status..."
                    if curl -s http://localhost:$PORT; then
                        echo "✅ App started successfully!"
                    else
                        echo "⚠️ App did not respond. Check $LOG_FILE for details."
                    fi
                '''
            }
        }
    }

    post {
        always {
            echo "📦 Pipeline complete. App log: $LOG_FILE"
        }
    }
}
