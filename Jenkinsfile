pipeline {
    agent any

    environment {
        APP_NAME = "src/app.js"
        SONAR_PROJECT_KEY = "sonar-scanner"
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
                withSonarQubeEnv('MySonar') {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        sh '''
                        export PATH=$SCANNER_HOME/bin:$PATH
                        sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.sources=src,prisma \
                            -Dsonar.inclusions=**/*.js,**/*.ts \
                            -Dsonar.exclusions=**/node_modules/** \
                            -Dsonar.host.url=$SONAR_HOST_URL \
                            -Dsonar.login=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Quality Gate') {
          steps {
             script {
                 timeout(time: 1, unit: 'HOURS') { // ⬅ increase from 1 to 10
                     waitForQualityGate abortPipeline: true
                   }
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
