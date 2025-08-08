pipeline {
    agent any

    environment {
        LOG_FILE = "${WORKSPACE}/output.log"
        NODE_PATH = "/usr/bin/node"
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📥 Checking out code..."
                git branch: 'main', url: 'https://github.com/WebMobi-3/cliniAura-backend-project.git'
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

                    PORT=3000
                    PID=$(lsof -ti tcp:$PORT || true)

                    if [ -n "$PID" ]; then
                        echo "Killing existing process on port $PORT (PID=$PID)..."
                        kill -9 $PID || true
                    fi

                    rm -f "$LOG_FILE"
                    cd "$WORKSPACE"
                    nohup $NODE_PATH src/app.js > "$LOG_FILE" 2>&1 &

                    sleep 5
                    curl -s http://localhost:$PORT || echo "App not responding yet"
                '''
            }
        }
    }
}
