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
                deleteDir() // This deletes all files in the workspace
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
                echo "🚀 Restarting the app using nohup..."

                sh '''
                echo "🔍 Checking for existing process on port $PORT..."
                PID=$(lsof -t -i:$PORT || true)

                if [ ! -z "$PID" ]; then
                    echo "❌ Killing process using port $PORT (PID=$PID)"
                    kill -9 $PID
                else
                    echo "✅ No existing process on port $PORT"
                fi

                echo "🎯 Starting app with nohup..."
                nohup npm start > $LOG_FILE 2>&1 &
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
