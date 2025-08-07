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
                echo "🚀 Stopping Node processes started from this workspace and starting the new app..."
                sh '''
                set -euo pipefail
                echo "🔍 Killing Node.js processes started from workspace ($WORKSPACE)..."

                # find node pids, check each pid's cwd, and only kill those inside $WORKSPACE
                for pid in $(pgrep -f "node" || true); do
                  if [ -d "/proc/$pid" ]; then
                    cwd=$(readlink -f /proc/$pid/cwd 2>/dev/null || true)
                    if [ -n "$cwd" ] && echo "$cwd" | grep -q "$WORKSPACE"; then
                      echo "Killing PID $pid (cwd: $cwd)"
                      sudo kill -9 $pid || true
                    fi
                  fi
                done

                echo "🎯 Starting app from current workspace ($WORKSPACE)..."
                cd "$WORKSPACE"
                # ensure node binds to all interfaces — adjust start script if it needs env vars
                nohup npm start > "$LOG_FILE" 2>&1 &
                sleep 3
                echo "✅ App started in background. Log file: $LOG_FILE"
                '''
            }
        }
    }

    post {
        failure {
            echo "❌ Build failed."
        }
        success {
            echo "✅ Build and deployment completed successfully."
        }
    }
}
