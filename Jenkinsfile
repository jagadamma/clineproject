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
                echo "🚀 Stopping any running Node process and starting the new app..."

                sh '''
                echo "🔍 Killing all Node.js processes..."
                pkill -f "node" || true

                echo "🎯 Starting app from current workspace..."
                nohup npm start > $LOG_FILE 2>&1 &
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
