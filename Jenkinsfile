pipeline {
    agent any

    environment {
        PORT = '3000'
        LOG_FILE = 'output.log'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                echo "🧹 Cleaning workspace..."
                deleteDir()
            }
        }

        stage('Git Checkout') {
            steps {
                echo "📥 Cloning repository..."
                git branch: 'main', credentialsId: 'gittoken', url: 'https://github.com/WebMobi-3/cliniAura-backend-project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "📦 Installing npm packages..."
                sh 'npm install'
            }
        }

        stage('Generate Prisma Client') {
            steps {
                echo "🔧 Generating Prisma client..."
                sh 'npx prisma generate'
            }
        }

        stage('Restart App in Background') {
            steps {
                echo "🚀 Restarting app and ensuring port $PORT is free..."
                sh '''
                    set -euo pipefail

                    echo "🔍 Checking if anything is running on port $PORT..."
                    PID=$(lsof -ti tcp:$PORT || true)
                    if [ -n "$PID" ]; then
                        echo "Found process $PID on port $PORT. Killing..."
                        kill -9 $PID || true
                    else
                        echo "No process found on port $PORT."
                    fi

                    echo "📂 Moving to workspace directory..."
                    cd "$WORKSPACE"

                    echo "🧹 Cleaning previous logs if any..."
                    rm -f "$LOG_FILE"

                    echo "📦 Starting Node.js app (src/app.js) in background..."
                    nohup node src/app.js > "$LOG_FILE" 2>&1 &

                    echo "⏱️ Waiting 5 seconds for app to boot..."
                    sleep 5

                    echo "📡 Checking if app is responding..."
                    curl -s http://localhost:$PORT || echo "⚠️ App may not be reachable yet."

                    echo "✅ App restart process completed. Check logs: $WORKSPACE/$LOG_FILE"
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Build and deployment completed successfully."
        }
        failure {
            echo "❌ Build failed. Check logs for errors."
        }
    }
}
