pipeline {
    agent any

    stages {

        stage('Clean Workspace') {
            steps {
                sh 'rm -rf /var/lib/jenkins/workspace/node/*'
            }
        }

        stage('Git Checkout') {
            steps {
                git branch: 'main', credentialsId: 'gittoken', url: 'https://github.com/WebMobi-3/cliniAura-backend-project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Generate Prisma Client') {
            steps {
                sh 'npx prisma generate'
            }
        }

        stage('Restart Server using nohup') {
            steps {
                script {
                    sh '''
                    echo "🔍 Checking for existing process on port 3000..."
                    PID=$(lsof -t -i:3000 || true)

                    if [ ! -z "$PID" ]; then
                        echo "❌ Killing process using port 3000 (PID: $PID)"
                        kill -9 $PID
                    else
                        echo "✅ No existing process on port 3000"
                    fi

                    echo "🚀 Starting app using nohup..."
                    nohup node src/app.js > app.log 2>&1 &
                    echo "✅ App started in background"
                    '''
                }
            }
        }
    }
}
