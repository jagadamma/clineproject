pipeline {
    agent any

    environment {
        APP_DIR = "/root/cliniAura-backend"
        LOG_FILE = "${APP_DIR}/output.log"
        APP_NAME = "cliniAura-app"
        APP_SCRIPT = "src/app.js"
    }

    stages {
        stage('Prepare App Directory') {
            steps {
                echo "📁 Preparing persistent app directory..."
                sh '''
                    mkdir -p "$APP_DIR"
                    rm -rf "$APP_DIR"/*
                '''
            }
        }

        stage('Checkout Code') {
            steps {
                echo "📥 Checking out code to persistent directory..."
                dir("${APP_DIR}") {
                    git branch: 'main', credentialsId: 'gittoken', url: 'https://github.com/Webmobi360-Development/cliniAura-backend-project.git'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "📦 Installing dependencies..."
                dir("${APP_DIR}") {
                    sh 'npm install'
                }
            }
        }

        stage('Start with PM2') {
            steps {
                echo "🚀 Starting app with PM2..."
                dir("${APP_DIR}") {
                    sh '''
                        # Check if app is running
                        if pm2 list | grep -q "$APP_NAME"; then
                            echo "♻️ Restarting existing PM2 app..."
                            pm2 restart "$APP_NAME"
                        else
                            echo "🚀 Starting new PM2 app..."
                            pm2 start "$APP_SCRIPT" --name "$APP_NAME" --output "$LOG_FILE" --error "$LOG_FILE"
                        fi

                        pm2 save
                        pm2 startup | tail -n 1 | bash || true
                    '''
                }
            }
        }

        stage('Verify App') {
            steps {
                echo "🌐 Verifying app is running..."
                sh 'sleep 5 && curl -s http://localhost:3000 || echo "❌ App not reachable"'
            }
        }
    }
}
