pipeline {
    agent any

    environment {
        LOG_FILE = "${WORKSPACE}/output.log"
    }

    stages {
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
                    cd /var/lib/jenkins/workspace/
                    rm -rf *  # deletes contents, not the directory itself

                    if pm2 list | grep -q src/app.js; then
                        pm2 restart src/app.js --output "$LOG_FILE" --error "$LOG_FILE"
                    else
                        pm2 start src/app.js --output "$LOG_FILE" --error "$LOG_FILE"
                    fi

                    sleep 5
                    curl -s http://localhost:3000 || echo "App not reachable yet"
                '''
            }
        }
    }
}
