pipeline {
    agent any

    tools {
        nodejs "nodejs" // Ensure NodeJS is configured in Jenkins Global Tools
    }

    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main', credentialsId: 'gittoken', url: 'https://github.com/WebMobi-3/cliniAura-backend-project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'rm -rf node_modules'
                sh 'rm -rf package-lock.json'
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
                    // Kill any existing Node process running on port 3000
                    sh '''
                    PID=$(lsof -t -i:3000)
                    if [ ! -z "$PID" ]; then
                      kill -9 $PID
                    fi
                    '''

                    // Start the updated app using nohup
                    sh 'nohup node src/app.js > app.log 2>&1 &'
                }
            }
        }
    }
}
