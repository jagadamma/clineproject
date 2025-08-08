pipeline {
    agent any

    environment {
        APP_NAME = "src/app.js"
        SONAR_PROJECT_KEY = "sonar-scanner"
        SONAR_HOST_URL = "http://localhost:9000" // Replace with your SonarQube URL
        SONAR_TOKEN = credentials('sonar-token') // Jenkins credential ID for SonarQube token
    }

    environment {
          SCANNER_HOME = tool name: 'SonarScannerCLI', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
    } 

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    credentialsId: 'gittoken',
                    url: 'https://github.com/Webmobi360-Development/cliniAura-backend-project.git'
            }
        }

        stage('Create .env File') {
            steps {
                sh '''
                echo 'DATABASE_URL="mysql://Cliniaura:CA%232025%2308@cliniaura.cgda62628ccx.us-east-1.rds.amazonaws.com:3306/CliniAura"' > .env
                
                echo 'JWT_SECRET=cliniauraSuperSecretKey@2025' >> .env
                echo 'TOKEN_EXPIRE=7d' >> .env
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                sh 'npx prisma migrate dev --name add-isStudent'
                sh 'npx prisma generate'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('MySonar') { // Name from Jenkins SonarQube server config
                    sh '''
                    sonar-scanner \
                      -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                      -Dsonar.sources=. \
                      -Dsonar.host.url=${SONAR_HOST_URL} \
                      -Dsonar.login=${SONAR_TOKEN}
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Restart App with PM2') {
            steps {
                sh "pm2 restart ${APP_NAME} || pm2 start ${APP_NAME}"
            }
        }

        stage('Save PM2 State') {
            steps {
                sh 'pm2 save'
            }
        }
    }
}
