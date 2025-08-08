pipeline {
    agent any

    environment {
        APP_NAME = "src/app.js"
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
                echo 'DATABASE_URL="mysql://Cliniaura:CA#2025#08@cliniaura.cgda62628ccx.us-east-1.rds.amazonaws.com:3306/CliniAura"' > .env
                echo 'JWT_SECRET=cliniauraSuperSecretKey@2025' >> .env
                echo 'TOKEN_EXPIRE=7d' >> .env
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                sh 'npx prisma generate'
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
