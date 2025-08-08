pipeline {
    agent any

    environment {
        LOG_FILE = "${WORKSPACE}/output.log"
        NODE_PATH = "/usr/bin/node"
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo '📥 Checking out code...'
                git branch: 'main', url: 'https://github.com/WebMobi-3/cliniAura-backend-project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing npm dependencies...'
                sh 'npm install'
            }
        }

        stage('Restart Node App in Background') {
            steps {
                echo '🚀 Restarting Node app.
